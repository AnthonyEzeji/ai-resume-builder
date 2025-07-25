import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'AI Resume Builder - Create Professional Resumes with ATS Optimization',
  description: 'Build professional resumes with AI-powered ATS scoring and optimization. Create, edit, and download resumes in multiple formats.',
  keywords: 'resume builder, ATS optimization, AI resume, professional resume, job application',
  authors: [{ name: 'AI Resume Builder Team' }],
  viewport: 'width=device-width, initial-scale=1',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
} 