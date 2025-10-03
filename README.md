# 📸 Professional Photography Portfolio

A modern photography portfolio website built with Next.js 14, Sanity CMS, and Tailwind CSS. This project showcases professional wildlife and landscape photography whilst demonstrating full-stack development capabilities with a headless CMS architecture.

## 🎯 Project Overview

This is my first production Next.js project, built for a real client. It's been a fantastic learning experience that's pushed me to understand:
1. **Headless CMS Architecture**: How to integrate Sanity Studio for client-managed content without touching code
2. **Server-Side Rendering**: Why SSR matters for SEO and initial page loads in photography portfolios
3. **Real-World Development**: Working with actual client requirements, iterating on feedback, and deploying to production

## 🚀 Features

### Current Features
- ✅ **Hero Carousel**: Auto-playing carousel with Embla - learnt how to handle autoplay state and prevent memory leaks
- ✅ **Sanity CMS Integration**: Built custom schemas for photos and categories, allowing the client to manage content independently
- ✅ **Dynamic Portfolio Galleries**: Category-based filtering that pulls directly from Sanity - understanding GROQ queries was key here
- ✅ **Responsive Design**: Mobile-first approach using Tailwind's breakpoint system
- ✅ **Contact Form**: Built a custom API route with server-side validation and integrated Resend for reliable email delivery
- ✅ **Modern UI**: Implemented shadcn/ui components and customised them to fit the minimal aesthetic
- ✅ **Performance Optimised**: Leveraged Next.js Image component and Sanity's CDN for fast image loading
- ✅ **SEO Ready**: Server-side rendering ensures search engines can properly crawl the portfolio

### Planned Features
- [ ] Advanced image watermarking
- [ ] Client testimonials section
- [ ] Blog/Journal for photography stories
- [ ] Enhanced analytics and tracking

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: JavaScript/JSX
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/) with Autoplay plugin
- **Icons**: Lucide React

### Backend & CMS
- **Headless CMS**: [Sanity.io](https://www.sanity.io/) (v3)
- **Content Management**: Sanity Studio (hosted at `/studio`)
- **Image Optimization**: Sanity's built-in CDN with automatic image transformations
- **API Routes**: Next.js API Routes for server-side logic

### Deployment & Infrastructure
- **Hosting**: [Vercel](https://vercel.com/)
- **Content Database**: Sanity Content Lake (cloud-hosted)
- **Email Service**: [Resend](https://resend.com/) for transactional emails
- **CDN**: Vercel Edge Network + Sanity's global CDN for images

## 📝 What I've Learnt

Coming from React, this project taught me loads about Next.js and full-stack development:

**Next.js Fundamentals**
- The App Router structure and how it differs from Pages Router
- Server-side rendering vs client-side rendering - when to use each
- File-based routing and how to organise a real application
- API routes for backend functionality without a separate server

**Working with a Headless CMS**
- Setting up and configuring Sanity Studio from scratch
- Writing content schemas and understanding document types
- GROQ queries for fetching data (like GraphQL but simpler)
- Real-time content updates without rebuilding the site

**Performance & Optimisation**
- How Next.js Image component handles responsive images automatically
- Understanding CDNs and why Sanity's image pipeline is brilliant for portfolios
- Lazy loading and code splitting for faster page loads
- Server-side rendering for better initial page performance

**Real-World Development**
- Client communication and managing requirements
- Iterative development based on feedback
- Deploying to Vercel and managing environment variables
- Integrating third-party services like Resend for emails

## 🏗️ Project Structure

```
sam-photography-portfolio/
├── website/                      # Main Next.js application
│   ├── app/                      # Next.js App Router
│   │   ├── api/contact/         # Contact form API endpoint
│   │   ├── about/               # About page
│   │   ├── portfolio/           # Portfolio gallery pages
│   │   └── contact/             # Contact page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── HeroCarousel.jsx     # Homepage hero carousel
│   │   ├── Navbar.jsx           # Site navigation
│   │   └── Footer.jsx           # Site footer
│   └── lib/
│       ├── sanity.js            # Sanity client configuration
│       └── utils.js             # Utility functions
├── studio/                       # Sanity Studio CMS
│   ├── schemas/                 # Content schemas
│   │   ├── category.js          # Portfolio categories
│   │   ├── photo.js             # Photo documents
│   │   └── settings.js          # Site settings
│   └── sanity.config.js         # Studio configuration
└── [config files]               # Next.js, Tailwind, etc.
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm package manager
- Sanity account (free tier available at [sanity.io](https://www.sanity.io/))

### Installation

1. Clone the repository
```bash
git clone https://github.com/charleshss/photography-portfolio.git
cd sam-photography-portfolio
```

2. Install dependencies for both website and studio
```bash
npm install
cd website && npm install
cd ../studio && npm install
```

3. Set up Sanity project
```bash
cd studio
npx sanity init
# Follow prompts to create/link your Sanity project
```

4. Configure environment variables
```bash
# Create .env.local in website directory
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

5. Run the development servers
```bash
# Terminal 1 - Website (from project root)
cd website
npm run dev

# Terminal 2 - Sanity Studio (from project root)
cd studio
npm run dev
```

6. Access the applications
- Website: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: [http://localhost:3333](http://localhost:3333)

## 🎨 Design Decisions

These choices were made to let the photography do the talking:

- **Minimal aesthetic**: Dark backgrounds and clean typography keep the focus on the images
- **Fast loading**: Used Sanity's CDN and Next.js image optimisation so galleries load quickly even on mobile
- **Professional look**: Clean, modern design that appeals to potential clients without being flashy
- **Easy navigation**: Simple menu structure - getting to any gallery is just one click away
- **Mobile-first**: Most people browse portfolios on their phones, so that's where I started the design

## 📈 Project Status

**Current Phase**: Production Ready - Active Maintenance
- ✅ Project structure and architecture
- ✅ Sanity CMS integration
- ✅ Hero carousel with auto-play
- ✅ Dynamic portfolio galleries
- ✅ Contact form with email integration
- ✅ Responsive design across all devices
- ✅ Deployed to production

## 🎯 Key Features Explained

### Sanity CMS Integration
One of the coolest parts of this project was implementing Sanity as a headless CMS. This means the client can manage all their photos without touching any code:

- **Photo Management**: They upload images directly to Sanity with titles, descriptions, and locations
- **Category System**: Simple tagging system for Wildlife, Landscape, etc.
- **Hero Carousel**: They choose which images feature on the homepage and in what order
- **Real-time Updates**: When they publish changes in Sanity Studio, the website updates immediately

This was a game-changer coming from hard-coded data - the client has full control without needing me for every update.

### Contact Form API
Built a custom Next.js API route that handles form submissions server-side:

- **Server-side Validation**: All validation happens on the server, so it can't be bypassed
- **Resend Integration**: Learnt how to integrate a transactional email service properly
- **CORS Protection**: Configured proper CORS headers to prevent unauthorised requests
- **HTML Templates**: Created professional-looking email templates with proper sanitisation
- **Reply-to Headers**: Set it up so the client can reply directly to enquiries from their email

This taught me a lot about API security and handling user input safely.

### Performance Optimisations
- **Server-Side Rendering**: Pages are rendered on the server first, so users see content faster
- **Sanity's Image CDN**: Images are automatically optimised, resized, and served in modern formats (WebP, AVIF)
- **Next.js Image Component**: Handles responsive images and lazy loading out of the box
- **Code Splitting**: Only loads the JavaScript needed for each page

## 📚 Technologies & Documentation

### Core Technologies
- [Next.js 14 Documentation](https://nextjs.org/docs) - React framework with SSR
- [Sanity.io Documentation](https://www.sanity.io/docs) - Headless CMS
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable component library
- [Embla Carousel](https://www.embla-carousel.com/) - Carousel library

### Deployment
- Vercel for Next.js hosting
- Sanity Content Lake for CMS data
- Vercel Edge Network for global CDN

## 👨‍💻 About This Project

Built by Charles Suddens-Spiers as my first production Next.js project. Coming from a React background, this was a brilliant opportunity to learn full-stack development whilst delivering a real client project.

**What This Project Demonstrates:**
- Building a production-ready application from scratch
- Integrating a headless CMS for client-managed content
- Creating custom API routes with proper security
- Deploying and maintaining a live website
- Working with real client requirements and feedback

This portfolio represents not just a finished product, but everything I've learnt about modern web development, from initial setup to production deployment.

## 📄 Licence

This project is private and belongs to the client. Portfolio images are copyrighted by the photographer.

---

*This is a live production site that's actively maintained and updated based on client needs.*