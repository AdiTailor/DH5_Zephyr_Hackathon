import { redirect } from 'next/navigation'

export default function HomePage() {
  // This component will immediately redirect the user to the dashboard.
  // The dashboard's layout will then check if the user is logged in.
  // If not, it will redirect them to the login page.
  redirect('/dashboard')
}