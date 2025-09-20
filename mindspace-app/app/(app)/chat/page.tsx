"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";


interface ChatUser {
  id: string;
  alias: string;
  online: boolean;
}

interface Message {
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // persistent, from Supabase
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Presence and user list logic
  const presenceInterval = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const supabase = createClient();
    let userId: string | null = null;
    let isMounted = true;
    // Get current user and set online status
    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setCurrentUser(data.user);
      userId = data.user?.id || null;
      if (userId) {
        // Set online on mount
        const updateUserStatus = async (online: boolean) => {
          try {
            console.log(`Updating user ${userId} status to ${online ? 'online' : 'offline'}`);
            const { error } = await supabase
              .from("user_status")
              .upsert({ 
                user_id: userId, 
                online, 
                last_active: new Date().toISOString() 
              });
            if (error) {
              console.error('Error updating user status:', error);
            } else {
              console.log(`Successfully updated user ${userId} status to ${online ? 'online' : 'offline'}`);
            }
          } catch (err) {
            console.error('Error in updateUserStatus:', err);
          }
        };

        // Update status immediately
        updateUserStatus(true);
        
        // Update last_active every 30s
        presenceInterval.current = setInterval(() => {
          updateUserStatus(true);
        }, 30000);

        // Set offline on unload
        const handleUnload = () => {
          updateUserStatus(false);
        };
        window.addEventListener("beforeunload", handleUnload);
        
        // Cleanup
        return () => {
          isMounted = false;
          if (presenceInterval.current) clearInterval(presenceInterval.current);
          window.removeEventListener("beforeunload", handleUnload);
          updateUserStatus(false);
        };
      }
    });
    // Fetch users and subscribe to presence changes
    const fetchUsers = async () => {
      try {
        // Fetch user_status rows
        const { data, error } = await supabase
          .from("user_status")
          .select("user_id, online, last_active");
        if (error) {
          console.error('Error fetching users:', error);
          return;
        }
        if (data && data.length > 0) {
          // Fetch aliases for all user_ids from profiles table
          const userIds = data.map((u: any) => u.user_id);
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, alias")
            .in("id", userIds);
          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
          }
          setUsers(
            data.map((u: any) => {
              const profile = profiles?.find((p: any) => p.id === u.user_id);
              return {
                id: u.user_id,
                alias: profile?.alias || "anon",
                online: u.online,
              };
            })
          );
        } else {
          console.log('No users found in user_status table.');
        }
      } catch (err) {
        console.error('Unexpected error in fetchUsers:', err);
      }
    };
    fetchUsers();
    const presenceSub = supabase
      .channel('user_status_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_status' }, fetchUsers)
      .subscribe();
    return () => {
      presenceSub.unsubscribe();
      if (presenceInterval.current) clearInterval(presenceInterval.current);
    };
  }, []);

  // Fetch and subscribe to messages between currentUser and selectedUser
  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    const supabase = createClient();
    let isMounted = true;

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, content, created_at")
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`)
        .order("created_at", { ascending: true });
      if (!isMounted) return;
      if (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } else {
        setMessages(data || []);
      }
    };
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages_realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `or(and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id}))`
      }, (payload: any) => {
        const msg = payload.new;
        // Only add if relevant to this chat
        if (
          (msg.sender_id === currentUser.id && msg.receiver_id === selectedUser.id) ||
          (msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id)
        ) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      channel.unsubscribe();
    };
  }, [selectedUser, currentUser]);

  // Only allow chat if both users are online
  const bothOnline = selectedUser && currentUser && selectedUser.online && users.find(u => u.id === currentUser.id)?.online;
  const sendMessage = async () => {
    if (!message.trim() || !selectedUser || !currentUser || !bothOnline) return;
    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      content: message,
    });
    if (error) {
      console.error('Error sending message:', error);
    }
    setMessage("");
  };

  return (
    <div className="flex h-[80vh] bg-white rounded-xl shadow mt-8">
      {/* User List */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Online Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-blue-50 ${selectedUser?.id === user.id ? "bg-blue-100" : ""} ${user.id === currentUser?.id ? "bg-gray-50" : ""}`}
              onClick={() => user.id !== currentUser?.id ? setSelectedUser(user) : null}
            >
              <span className={`w-2 h-2 rounded-full ${user.online ? "bg-green-500" : "bg-gray-300"}`}></span>
              <span>{user.alias}</span>
              {user.id === currentUser?.id && <span className="text-xs text-gray-500 ml-2">(You)</span>}
            </li>
          ))}
        </ul>
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          bothOnline ? (
            <>
              <div className="border-b p-4 font-semibold">{selectedUser.alias}</div>
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`mb-2 ${msg.sender_id === currentUser?.id ? "text-right" : "text-left"}`}>
                    <span className={`inline-block px-3 py-1 rounded-lg ${msg.sender_id === currentUser?.id ? "bg-blue-200" : "bg-gray-200"}`}>
                      {msg.content}
                    </span>
                    <div className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
              <form
                className="flex p-4 border-t"
                onSubmit={e => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  className="flex-1 border rounded-l px-3 py-2"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-r" type="submit">Send</button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Chat unavailable: one user is offline</div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
}
