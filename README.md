This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Song Request MVP

RAASTE includes a public `/request` page where visitors can submit 5-15 songs for a future personal RAASTE page. Requests are private and are inserted only through the server-side `POST /api/song-request` route.

### Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the schema in `supabase/song_requests.sql`.
4. Add these environment variables locally and in Vercel:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not expose the service role key in the browser. Do not create a `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`.

### Local Testing

```bash
npm install
npm run dev
```

Open `http://localhost:3000/request`. Without Supabase environment variables, the form and build still work, but valid submissions return a configuration error instead of pretending to save.

### Deployment

On Vercel, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the project environment variables before deploying. A future email provider such as Resend can be integrated after review/publishing exists; for now, the API stores `notification_status = 'not_sent'`.
