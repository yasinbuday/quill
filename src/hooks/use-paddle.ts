'use client'

import { initializePaddle, Paddle } from '@paddle/paddle-js'
import { useEffect, useState } from 'react'

export default function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle>()

  useEffect(() => {
    initializePaddle({
      environment:"sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!
    }).then((paddleInstance) => {
      if (paddleInstance) {
        setPaddle(paddleInstance)
      }
    })
  }, [])

  return paddle
}