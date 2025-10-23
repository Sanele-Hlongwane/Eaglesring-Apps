# 🦅 Eagles Ring

**Eagles Ring** is an elite platform crafted to bridge the gap between visionary entrepreneurs and discerning investors. By streamlining the pitching process, we offer both asynchronous and real-time engagement opportunities, ensuring seamless connections and fostering fruitful investment opportunities. Whether you're an entrepreneur with groundbreaking ideas or an investor seeking the next big venture, Eagles Ring is your gateway to success.

## ✨ Features

- **User Authentication & Role Management:** Secure, streamlined login with role-based access for both entrepreneurs and investors.
- **Subscription Plans:** Tailored subscription models powered by Stripe, offering various tiers to access premium features and live events.
- **Pitch Submission:** Entrepreneurs can submit comprehensive business pitches that investors can browse and review at their convenience.
- **Feedback System:** A robust feedback mechanism allows investors to provide constructive feedback on pitches, with instant notifications sent to entrepreneurs.
- **Live Pitch Events:** Integrated real-time video pitch sessions, powered by Twilio, for direct and engaging interactions.
- **Investor Requests:** Investors can issue specific requests to entrepreneurs, enabling targeted pitch responses and opportunities.
- **Analytics Dashboard:** Track pitch performance, investor engagement, and feedback trends with advanced analytics tools.
- **Global Reach:** Connect with investors worldwide, expanding the potential reach of every pitch.
- **Data Security & Privacy:** Advanced security measures to ensure all sensitive information is protected.

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/)
- **Backend:** [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- **Authentication:** [Clerk](https://clerk.dev/)
- **Database:** [Supabase](https://supabase.io/) (PostgreSQL)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Real-Time Updates:** [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), [GetStream](https://getstream.io/)
- **Video Streaming:** [Twilio](https://www.twilio.com/)
- **UI Components:** [NextUI](https://nextui.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Deployment:** [Vercel](https://vercel.com/), [Docker](https://www.docker.com/)
- **Contact Form:** [Formspree](https://formspree.io/)

## 🚀 Installation

### Prerequisites

- Node.js v14.x or higher
- Supabase (PostgreSQL)
- npm or yarn
- Docker (optional for containerized deployment)

### Clone the Repository

```bash
git clone https://github.com/Sanele-Masumpa/eaglesring.git
cd eaglesring
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables. **Replace the placeholders with your actual secret values.**

```env
# Clerk API Keys
CLERK_WEBHOOK_SECRET=<YOUR_CLERK_WEBHOOK_SECRET>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
CLERK_SECRET_KEY=<YOUR_CLERK_SECRET_KEY>

# Supabase Database URL
SUPABASE_URL=<YOUR_SUPABASE_URL>
SUPABASE_KEY=<YOUR_SUPABASE_KEY>

# Prisma and Supabase database connection URL
DATABASE_URL=<YOUR_SUPABASE_ORM_KEY>

# Stream API Keys
NEXT_PUBLIC_STREAM_API_KEY=<YOUR_STREAM_API_KEY>
STREAM_SECRET_KEY=<YOUR_STREAM_SECRET_KEY>

# Pusher API Keys
NEXT_PUBLIC_PUSHER_APP_ID=<YOUR_PUSHER_APP_ID>
NEXT_PUBLIC_PUSHER_KEY=<YOUR_PUSHER_KEY>
PUSHER_SECRET=<YOUR_PUSHER_SECRET>
NEXT_PUBLIC_PUSHER_CLUSTER=<YOUR_PUSHER_CLUSTER>

# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
STRIPE_WEBHOOK_SECRET=<YOUR_STRIPE_WEBHOOK_SECRET>

# Stripe Price IDs
NEXT_PUBLIC_BASIC_PLAN_PRICE_ID=<YOUR_BASIC_PLAN_PRICE_ID>
NEXT_PUBLIC_PRO_PLAN_PRICE_ID=<YOUR_PRO_PLAN_PRICE_ID>
NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID=<YOUR_PREMIUM_PLAN_PRICE_ID>
NEXT_PUBLIC_PRO_ANNUAL_PRICE_ID=<YOUR_PRO_ANNUAL_PRICE_ID>
NEXT_PUBLIC_PREMIUM_ANNUAL_PRICE_ID=<YOUR_PREMIUM_ANNUAL_PRICE_ID>

# Application URL
NEXT_PUBLIC_URL=<REPLACE_WITH_YOUR_URL>

# Formspree API Key
FORMSPREE_API_KEY=<YOUR_FORMSPREE_API_KEY>
```

## 🎨 Usage

### User Authentication and Role Assignment

- **Sign Up:** Users sign up using Clerk, and upon first login, select their role (entrepreneur or investor).
- **Role-Specific Dashboard:** The role selected determines the user's dashboard, available features, and subscription plans.

### Subscription Plans

- **Stripe Integration:** Access premium features through tailored subscription models. Stripe handles secure payment processing and subscription management.
- **Plan Tiers:** Offer basic, pro, and premium plans with both monthly and annual options to fit diverse user needs.

### Pitch Submission & Feedback

- **Entrepreneur Dashboard:** Entrepreneurs submit pitches through an intuitive, user-friendly interface.
- **Investor Dashboard:** Investors can browse, filter, and review pitches, providing detailed feedback or expressing interest.

### Live Pitch Events

- **Scheduling:** Entrepreneurs schedule live pitch events through Twilio, ensuring direct, real-time investor engagement.
- **Interactive Sessions:** Investors can join sessions, ask questions, and make immediate investment decisions.

### Real-Time Notifications

- **Stay Updated:** Real-time notifications via WebSockets and GetStream keep users informed of feedback, investor interest, and pitch status.

### UI/UX Enhancements

- **Responsive Design:** Fully responsive design for seamless experiences across devices.
- **Dark Mode:** Toggle between light and dark themes to suit user preferences.
- **Interactive Elements:** Engage users with smooth animations, flipping cards, and more.

## 📧 Contact

For any inquiries or feedback, please reach out through our contact form:

- **[Contact Us](https://eaglesring-app.vercel.app/contact)**

You can also contact us directly:

- **Name:** Sanele Hlongwane
- **Email:** [sanelehlongwane61@gmail.com](mailto:sanelehlongwane61@gmail.com)
- **GitHub:** [Sanele-Masumpa](https://github.com/Sanele-Masumpa)
- **Phone Number:** +27 (603)-179-552
