import { argv } from 'node:process'
import stream from 'node:stream'
import { pipeline as streamPipeline } from 'node:stream/promises'
import express from 'express'
import compression from 'compression'
import { createServer as createViteServer } from 'vite'
import chalk from 'chalk'
import got from 'got'
import 'dotenv/config'

const now = () => (new Date()).toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai' })
const isDev = argv[2] === 'dev'

const log = (module, url, info) => {
  if (isDev)
    console.log(`${chalk.gray(now())} ${chalk.cyan.bold(`[${module}]`)} ${chalk.green(url)} ${info ? chalk.yellow(info) : ''}`)
}

async function createServer() {
  const app = express()
  app.post('/api/chat', async (req, res) => {
    const upstream = got.stream.post('https://open.westlakechat.com/api/v1/cs/chat', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${process.env.WESTLAKECHAT_OPEN_API_KEY}`,
      },
    })
    res.setHeader('Content-Type', 'text/event-stream')
    await streamPipeline(
      req,
      new stream.PassThrough(),
      async function* (source) {
        let data = Buffer.from([])
        for await (const chunk of source)
          data = Buffer.concat([data, chunk])
        const body = JSON.parse(data.toString())
        yield JSON.stringify({
          ...body,
          bot_id: process.env.WESTLAKECHAT_OPEN_BOT_ID,
        })
      },
      upstream,
      new stream.PassThrough(),
      res,
    ).catch((err) => {
      console.error(err)
      res.status(500).end()
    })
  })
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
    })
    app.use((req, res, next) => {
      log('vite', req.url)
      vite.middlewares(req, res, next)
    })
  }
  else {
    app.use(compression())
    app.use(express.static('dist'))
  }
  app.listen(5173)
}

createServer()
