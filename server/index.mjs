import stream from 'node:stream'
import process from 'node:process'
import { Buffer } from 'node:buffer'
import { pipeline as streamPipeline } from 'node:stream/promises'
import express from 'express'
import compression from 'compression'
import got from 'got'
import 'dotenv/config'

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
  app.use(compression())
  app.use(express.static('dist'))
  app.listen(3000)
}

createServer()
