# M.A.T. Furniture Showroom

A modern, fast, and fully responsive furniture showroom website built with React, Vite, and TanStack Start. It features a catalog browsing experience, product details, a custom admin dashboard for content management, and WhatsApp integration for direct inquiries.

## Tech Stack
- **Framework:** React 19 + TanStack Start (SSR ready)
- **Styling:** Tailwind CSS v4 + Vanilla CSS + Framer Motion
- **Database / Auth:** Firebase Firestore + Authentication
- **Image Hosting:** Cloudinary
- **Deployment:** Cloudflare Workers (configured)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory and copy the values from `.env.example`.
   You will need to configure:
   - Firebase Project (Auth & Firestore)
   - Cloudinary Account (Unsigned Upload Preset)
   - WhatsApp Number

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Admin Panel
Access the admin panel at `/admin/login` using the email and password you set up in your Firebase Authentication console. From there, you can add, edit, and delete products from the catalog.

## Deployment
This project is pre-configured to deploy to Cloudflare Workers.
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler deploy
```
*Note: Make sure to set your environment variables in the Cloudflare dashboard.*
