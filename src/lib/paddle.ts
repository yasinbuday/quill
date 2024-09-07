import { Environment, Paddle } from '@paddle/paddle-node-sdk'
import type { Paddle as PaddleType } from '@paddle/paddle-node-sdk'

const globalForPaddle = globalThis as unknown as {
  paddle: PaddleType
}

const paddle =
  globalForPaddle.paddle ||
  new Paddle(process.env.PADDLE_API_KEY!, {
    environment: Environment.sandbox,
  })

if (process.env.NODE_ENV !== 'production') globalForPaddle.paddle = paddle

export { paddle }