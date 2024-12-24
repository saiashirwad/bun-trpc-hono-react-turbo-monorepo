import { appRouter } from '@xyz/trpc'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { trpcServer } from './trpc-hono'

const NODE_ENV = process.env.NODE_ENV || 'development'
console.log(`Starting server in ${NODE_ENV} mode`)

const app = new Hono()

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
  }),
)

app.use('/assets/*', serveStatic({ root: '../client/dist' }))

app.get('*', async (c) => {
  if (!c.req.path.startsWith('/trpc/')) {
    try {
      const html = await Bun.file('../client/dist/index.html').text()
      return c.html(html)
    } catch (error) {
      console.error('Error serving index.html:', error)
      return c.text('Error serving application', 500)
    }
  }
})

export default {
  fetch: app.fetch,
  port: Number(process.env['PORT']) || 3000,
  reusePort: true,
}
