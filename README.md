# Personal Portfolio — React + Tailwind

A high-converting personal portfolio built with React, Tailwind CSS, and Framer Motion.

## Pages
- `/` — Home / Hero
- `/about` — About + Experience + Skills
- `/projects` — Projects grid with modal case studies
- `/blog` — Blog with search + category filter
- `/services` — Services + Pricing + FAQ
- `/testimonials` — Client testimonials + logos
- `/contact` — Contact form with validation
- `/resume` — Resume with animated skill bars

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build
```

## Customization

All content is in each page file. To make it yours:

1. **Replace name/details** — Search for "John Doe" across all files
2. **Update colors** — Edit `accent` in `tailwind.config.js`
3. **Update fonts** — Edit `fontFamily` in `tailwind.config.js` + `index.html`
4. **Add your photo** — Replace the placeholder div in `Home.jsx` and `About.jsx` with `<img src="/photo.jpg" />`
5. **Add your projects** — Edit the `projects` array in `Projects.jsx`
6. **Add your blog posts** — Edit the `posts` array in `Blog.jsx`

## Tech Stack
- React 18
- React Router v6
- Tailwind CSS
- Framer Motion
- Lucide Icons
- React Helmet Async

## Deployment
Deploy to Vercel in one command:
```bash
npx vercel
```
