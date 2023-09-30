import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { getProject } from '@/services/project'
import { TProject } from '@/types'
import { PlanAlert } from '@/components/plan-alert'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AppFrame'
}

function isProject(data: TErrorResponse|{project: TProject}): data is {project: TProject} {
  return !!(data as {project: TProject}).project;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let name = 'AppFrame';
  let trialFinishedAt: Date|null = null;

  const dataProject: TErrorResponse|{project: TProject} = await getProject();
  if (isProject(dataProject)) {
    const {project} = dataProject;
    name = project.name;
    trialFinishedAt = project.trialFinishedAt;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <Header name={name} />
        </header>
        <div className='container'>
          <div className='sidebar'><Sidebar /></div>
          <main>{children}</main>
        </div>

        <PlanAlert trialFinishedAt={trialFinishedAt} />
      </body>
    </html>
  )
}
