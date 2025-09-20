-----

````markdown
# MindSpace 🧠✨

*A safe space for self-reflection and anonymous peer support. Built for the DH5 Zephyr Hackathon.*

---

## 🚀 Problem Statement

Mental health challenges are often hidden due to stigma. Students need a safe, anonymous, and accessible digital space to reflect on their thoughts, connect with peers, and seek support without fear of judgment. MindSpace is a full-stack web application designed to be that space.

## 🛠️ Tech Stack

Our stack is chosen for rapid development, performance, and a modern user experience.

| Technology      | Purpose                               |
| --------------- | ------------------------------------- |
| **Next.js** | Full-stack React Framework            |
| **React** | UI Library                            |
| **TypeScript** | Static Typing for Code Quality        |
| **Tailwind CSS**| Utility-First CSS Framework         |
| **Shadcn/UI** | Re-usable UI Components               |
| **Supabase** | Backend-as-a-Service (Auth & DB)      |

## ✅ Current Status (As of 1:30 AM Saturday)

The foundation is solid and the core user loop is **complete**. Here's what's working right now:

* **Project Setup:** The Next.js project is fully configured with all necessary dependencies.
* **Database Schema:** All tables (`profiles`, `journal_entries`, `community_posts`) are created and configured in Supabase with Row Level Security.
* **Authentication:** A complete authentication flow is working. Users can sign in anonymously, and the session is managed securely.
* **Journal Feature:** The private journaling feature is **fully functional**. Logged-in users can create new journal entries with mood selections and view their past entries.

---

## 🏁 Getting Started: A Guide for the Team

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

First, get the code onto your machine.

```bash
git clone <repository-url>
cd mindspace-app
````

### 2\. Install Dependencies

This will install all the necessary packages.

```bash
npm install
```

### 3\. Set Up Environment Variables (CRITICAL)

The project needs to connect to our Supabase backend.

1.  Ask the team member who set up the Supabase project to share two secret keys: the **Project URL** and the **`anon` public key**.
2.  In the root of the project, create a new file named `.env.local`.
3.  Copy the following into that file and paste the shared keys:

<!-- end list -->

```env
NEXT_PUBLIC_SUPABASE_URL='https://kxlaxuwzrrfzrgwmxcsi.supabase.co'
NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bGF4dXd6cnJmenJnd214Y3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDQ0NTgsImV4cCI6MjA3Mzg4MDQ1OH0.tuwyWyNudZzptWh3_CO6YEQUxKsnjbDYUoSKBPwP4H0'
```

**Note:** The app will not start without this file.

### 4\. Run the Development Server

You're all set\! Run this command to start the app.

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`.

-----


