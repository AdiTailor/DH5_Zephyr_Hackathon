"use client";
import dynamic from "next/dynamic";
import type { MoodEntry } from "./page";

const MoodChart = dynamic(() => import("@/components/features/dashboard/MoodChart"), { ssr: false });

export default function DashboardChartClient({ entries }: { entries: MoodEntry[] }) {
  return <MoodChart data={entries} />;
}
