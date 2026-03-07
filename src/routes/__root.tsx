import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { HeroUIProvider } from '@heroui/react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  // shellComponent: RootDocument,
  component: RootDocument
})

function RootDocument() {
  return (<>
    <head>
      <HeadContent />
    </head>
    <HeroUIProvider>

      <main className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <Outlet />
        <Scripts />
      </main>
    </HeroUIProvider>
  </>
  )
}
