import { AuthProvider } from '../components/auth/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Eden Intelligence',
  description: 'AI Meeting Intelligence App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-inter bg-[#F9FAFB] text-gray-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
