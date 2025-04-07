export { default } from "next-auth/middleware"

export const config = { matcher: ["/app/:path*", "/join/:path*", "/room/:path*"] }