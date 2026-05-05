import { AuthProvider } from '../components/auth/AuthContext';
import QueryProvider from '../components/providers/QueryProvider';
import './globals.css';

export const metadata = {
  title: 'Claeron',
  description: 'Enterprise Meeting Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-inter bg-[#F9FAFB] text-gray-900">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
