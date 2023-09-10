import type { Metadata } from 'next'
import { Topbar } from '@/components/topbar'

export const metadata: Metadata = {
  title: 'Home | AppFrame'
}

export default function Home() {
  return (
    <div className='page'>
      <Topbar title='Home' />
    </div>
  )
}
