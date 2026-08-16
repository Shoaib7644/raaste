import { Rest } from 'ably'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CHANNEL_NAME = 'raaste:listeners'
const TOKEN_TTL_MS = 10 * 60 * 1000
const CLIENT_ID_PATTERN = /^raaste-listener-[a-zA-Z0-9_-]{16,80}$/

export async function GET(request: Request) {
  const apiKey = process.env.ABLY_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Presence unavailable' }, { status: 503 })
  }

  const clientId = new URL(request.url).searchParams.get('clientId')

  if (!clientId || !CLIENT_ID_PATTERN.test(clientId)) {
    return Response.json({ error: 'Invalid client id' }, { status: 400 })
  }

  const ably = new Rest({ key: apiKey })
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId,
    ttl: TOKEN_TTL_MS,
    capability: {
      [CHANNEL_NAME]: ['presence', 'subscribe'],
    },
  })

  return Response.json(tokenRequest, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
