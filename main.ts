import { Hono } from 'hono'
import { upgradeWebSocket } from 'https://deno.land/x/hono@v4.1.5/helper.ts'

import { parseArgs } from 'https://deno.land/std@0.207.0/cli/parse_args.ts'

const flags = parseArgs(Deno.args, {
  boolean: ['help'],
  string: ['port'],
  default: {
    port: '8080',
  },
  negatable: [],
})

const targetFile = flags._[0]

if (typeof targetFile !== 'string') {
  throw new Error('targetFile must be string')
}

const port = parseInt(flags.port)

const app = new Hono()

app.get('/', async (c) => {
  c.header('Content-Type', 'text/javascript')

  const clientData = await Deno.readTextFile('./client/main.js')
  return c.body(clientData)
})

app.get(
  '/ws',
  upgradeWebSocket(() => {
    const watcher = Deno.watchFs(targetFile)
    return {
      async onOpen(_evt, ws) {
        for await (const _changed of watcher) {
          ws.send(await Deno.readTextFile(targetFile))
        }
      },
      onClose() {
        watcher.close()
      },
    }
  }),
)

Deno.serve({
  port,
  onListen(data) {
    const baseUrl = `http://${data.hostname}:${data.port}`
    const connect = 'Paste to parent container console!:\n' +
      `fetch('${baseUrl}').then(r=>r.text()).then(s=>new Function('data',s)({base:'${baseUrl}'}))\n` +
      'Would you like to stop? Try `_realtimeCss.close()`'
    console.info(connect)
  },
}, app.fetch)
