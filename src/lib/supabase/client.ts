import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = document.cookie
            ?.split('; ')
            .map(c => {
              const [name, ...rest] = c.split('=')
              return { name, value: rest.join('=') }
            }) ?? []
          return cookies
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            const cookieStr = `${name}=${value}; path=/; max-age=${options?.maxAge ?? 3600}; samesite=lax`
            document.cookie = cookieStr
          })
        },
      },
    }
  )
}
