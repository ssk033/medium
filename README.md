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

Open [https://zingg-eight.vercel.app/](https://zingg-eight.vercel.app/) with your browser to see the result.

For local development, run the dev server and open [http://localhost:3000](http://localhost:3000).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://zingg-eight.vercel.app
# For local development, use: NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth (optional - just paste your keys here and it will work!)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

### LinkedIn Setup
To enable LinkedIn login:
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Get your Client ID and Client Secret
4. Add them to your `.env.local` file as shown above
5. The LinkedIn login will automatically work once the keys are added!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
