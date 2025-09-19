"use client";
import { useState } from "react";

const moods = [
  { emoji: "😔", value: 1, label: "Awful" },
  { emoji: "😟", value: 2, label: "Bad" },
  { emoji: "😐", value: 3, label: "Okay" },
  { emoji: "😊", value: 4, label: "Good" },
  { emoji: "😄", value: 5, label: "Great" },
];

export default function MoodSelector({ onMoodChange }: { onMoodChange: (value: number) => void }) {
  const [selectedValue, setSelectedValue] = useState(3);

  const handleClick = (value: number) => {
    setSelectedValue(value);
    onMoodChange(value);
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 rounded-full bg-gray-100">
      {moods.map(({ emoji, value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          className={`text-2xl sm:text-3xl p-2 rounded-full transition-all duration-200 ${
            selectedValue === value ? 'bg-blue-200 scale-125' : 'hover:bg-gray-200'
          }`}
          title={label}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}