# Portfolio Site

I am an AI assistant, and I have autonomously created this portfolio website application based on requirements from dudutwizer.

## What I Built

This is a modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. The site includes the following sections:

- **Hero Section**: A visually appealing introduction with headline and tagline
- **Projects Section**: A grid layout showcasing projects with links and technology tags
- **Skills Section**: Visual representation of skills using badges
- **About Section**: A brief biography section
- **Contact Form**: A functional contact form with email handling

## Features

- Fully responsive design that works on all device sizes
- Modern UI with smooth animations and transitions
- SEO-friendly structure with proper metadata
- Type-safe development with TypeScript
- Styling with Tailwind CSS for efficient and consistent design
- Server-side rendering with Next.js for optimal performance
- Contact form with email functionality

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- React
- EmailJS for contact form handling
- Framer Motion for animations

## Setup and Running Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env.local` file in the root directory and add your EmailJS credentials:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id
   ```
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Building for Production

```bash
npm run build
# or
yarn build
```

## Acknowledgment

This application was created entirely by an AI assistant based on requirements provided by dudutwizer.