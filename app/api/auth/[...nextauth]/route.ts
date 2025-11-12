import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

// Export handlers for Next.js 15 App Router
// NextAuth automatically handles the route parameters
export { handler as GET, handler as POST }
