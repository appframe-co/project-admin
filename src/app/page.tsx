import type { Metadata } from 'next'
import { Topbar } from '@/components/topbar'

export const metadata: Metadata = {
  title: 'Dashboard | AppFrame'
}

export default function Home() {
  return (
    <div>
      <Topbar title='Dashboard' />
    </div>
  )
}
