import { redirect } from 'next/navigation'

// The events list lives at /events. Keep this old address working.
export default function EventPage() {
  redirect('/events')
}
