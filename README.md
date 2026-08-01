# Mohamed Saied — Interactive Portfolio

A one-page cinematic portfolio built with **Next.js 15**, **React Three Fiber**, **GSAP**, **Framer Motion**, and **Lenis** smooth scroll.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Customize

| What | Where |
|------|--------|
| Bio, links, email | `src/data/contact.ts` |
| Projects | `src/data/projects.ts` |
| Skills | `src/data/skills.ts` |
| Stats & timeline | `src/data/stats.ts` |
| Site URL (SEO) | `NEXT_PUBLIC_SITE_URL` in `.env.local` |

Update GitHub, LinkedIn, email, and CV path in `contact.ts` before deploying.

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4
- Three.js · @react-three/fiber · @react-three/drei · postprocessing
- GSAP · Framer Motion · Lenis · React Icons

## Deploy

Works on Vercel or any Node host. Set `NEXT_PUBLIC_SITE_URL` to your production domain for sitemap and Open Graph.
