import type { Metadata } from 'next'
import Image from 'next/image'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Dashboard | AppFrame'
}

export default function Home() {
  return (
    <main>
      <p>Dashboard</p>
    </main>
  )
}
