import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Portfolio | Professional Web Developer',
  description: 'A showcase of my projects, skills, and experience as a web developer.',
  keywords: 'web developer, portfolio, frontend, backend, full-stack, projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-light dark:bg-dark text-dark dark:text-light`}>
        {children}
      </body>
    </html>
  )
}