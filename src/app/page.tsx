import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard | AppFrame'
}

export default function Home() {
  return (
    <main>
      <p>Dashboard</p>
      
      <ul>
        <li><Link href='/structures'>Structures</Link></li>
        <li><Link href='/storage'>Storage</Link></li>
        <li><Link href='/users'>Users</Link></li>
        <li><Link href='/settings'>Settings</Link></li>
      </ul>
    </main>
  )
}
