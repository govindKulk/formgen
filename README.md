# FormGen - Advanced Multi-Step Form Builder

[![Next.js](https://img.shields.io/badge/Next.js-15.4.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

🚀 **Live Demo:** [https://formgene.vercel.app](https://formgene.vercel.app)

## Overview

FormGen is a modern, feature-rich form builder that enables users to create sophisticated multi-step forms with drag-and-drop functionality, real-time analytics, and comprehensive response management. Built with cutting-edge web technologies, it offers a seamless experience for both form creators and respondents.

![FormGen Banner](https://img.shields.io/badge/FormGen-Professional_Form_Builder-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgNkg5VjEySDE1VjZIMjFWMTJIMTVWMThIOVYxMkgzVjZ6IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2Zz4=)

## ✨ Key Features

### 🎨 **Intuitive Form Builder**
- **Drag & Drop Interface**: Effortlessly design forms with a visual drag-and-drop builder
- **Multi-Step Forms**: Create complex workflows with unlimited steps and conditional logic
- **Rich Component Library**: 10+ form components including inputs, selects, checkboxes, switches, and more
- **Real-time Preview**: Live preview mode to test forms before publishing
- **Responsive Design**: Mobile-first approach ensures forms look perfect on all devices

### 🎯 **Advanced Form Management**
- **Auto-Save Functionality**: Intelligent debounced auto-save prevents data loss
- **Step Management**: Add, delete, and reorder form steps with ease
- **Component Properties**: Comprehensive property panels for customization
- **Form Validation**: Built-in validation with custom error messages
- **Theme Customization**: Full control over colors, branding, and styling

### 📊 **Powerful Analytics Dashboard**
- **Comprehensive Metrics**: Track visits, submissions, conversion rates, and unique visitors
- **Interactive Charts**: Beautiful visualizations with Recharts integration
- **Time-series Analysis**: 30-day trend analysis with daily granularity
- **Response Management**: Detailed response viewer with filtering and search
- **Real-time Updates**: Live data updates without page refresh

### 🔐 **Enterprise-Ready Security**
- **User Authentication**: Secure authentication powered by Clerk
- **Access Control**: Role-based permissions and form ownership
- **Anonymous Responses**: Optional anonymous submission support
- **Data Privacy**: GDPR-compliant data handling and storage
- **Duplicate Prevention**: Intelligent duplicate submission detection

### 🌐 **Public Form Sharing**
- **Shareable URLs**: Generate unique, secure links for form distribution
- **Visitor Tracking**: Advanced visitor analytics with IP and email tracking
- **Publishing Controls**: Draft/published states with instant deployment
- **Embedded Forms**: Support for iframe embedding (coming soon)

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.4.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.x** - Modern utility-first CSS framework
- **Motion (Framer Motion)** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant form management
- **Zod** - Schema validation and type inference

### **Backend & Database**
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database (Prisma-compatible)
- **Redis (Upstash)** - Caching and session management
- **Next.js API Routes** - Serverless API endpoints

### **Development & Deployment**
- **Zustand** - Lightweight state management
- **React Hot Toast** - Beautiful notifications
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icon library
- **Vercel** - Seamless deployment and hosting

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager
- PostgreSQL database
- Redis instance (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/govindKulk/formgen.git
   cd formgen
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/formgen"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Optional: Redis for caching
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Optional: Seed database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
formgen/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── forms/            # Form management pages
│   ├── analytics/        # Analytics dashboard
│   └── s/                # Public form pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── form-canvas.tsx   # Main form builder
│   └── properties-panel.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── types/            # TypeScript definitions
│   └── visitor-tracking.ts
├── store/                 # Zustand state management
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🔧 Key Features Implementation

### Form Builder Architecture
- **Component-based Design**: Modular form components with standardized interfaces
- **State Management**: Zustand store with persistent form state
- **Drag & Drop**: DnD Kit integration for intuitive form building
- **Type Safety**: Full TypeScript coverage with Zod schema validation

### Analytics Engine
- **Visitor Tracking**: Multi-strategy visitor identification (Redis → Database → Memory)
- **Real-time Metrics**: Live updates using efficient database queries
- **Chart Integration**: Custom chart components using Recharts
- **Data Export**: Comprehensive analytics data with CSV export capabilities

### Performance Optimizations
- **Debounced Auto-save**: Intelligent saving to prevent excessive API calls
- **Selective Re-rendering**: Optimized React components with minimal re-renders
- **Efficient Queries**: Optimized database queries with proper indexing
- **Caching Strategy**: Redis-based caching for frequently accessed data

## 📚 API Documentation

### Form Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/forms` | Create a new form |
| `GET` | `/api/forms` | List user's forms |
| `GET` | `/api/forms/[id]` | Get specific form |
| `PUT` | `/api/forms/[id]` | Update form |
| `DELETE` | `/api/forms/[id]` | Delete form |

### Public Form Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/forms/public/[shareUrl]` | Get public form |
| `POST` | `/api/forms/public/[shareUrl]` | Submit form response |

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/forms/[id]/analytics` | Get form analytics |

## 🎯 Best Practices Implemented

### Code Quality
- **TypeScript First**: Comprehensive type safety across the entire application
- **Component Architecture**: Reusable, composable components with clear interfaces
- **Error Handling**: Robust error boundaries and graceful error handling
- **Performance Optimization**: Lazy loading, memoization, and efficient re-rendering

### Security
- **Authentication**: Secure user authentication with Clerk
- **Authorization**: Proper access control for form ownership
- **Input Validation**: Server-side validation with Zod schemas
- **SQL Injection Prevention**: Prisma ORM with parameterized queries

### User Experience
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA compliance and keyboard navigation support
- **Loading States**: Comprehensive loading indicators and skeleton screens
- **Error Feedback**: Clear, actionable error messages and validation feedback

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Govind Kulkarni**
- 🌐 Website: [govindkulkarni.me](https://govindkulkarni.me)
- ✉️ Email: [kulkarnigovind2003@gmail.com](mailto:kulkarnigovind2003@gmail.com)
- 🐙 GitHub: [@govindKulk](https://github.com/govindKulk)
- 💼 LinkedIn: [Connect with me](https://linkedin.com/in/govindkulkarni2003)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Clerk](https://clerk.dev/) - Complete user management
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Vercel](https://vercel.com/) - Platform for frontend developers

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/govindKulk/formgen?style=social)](https://github.com/govindKulk/formgen/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/govindKulk/formgen?style=social)](https://github.com/govindKulk/formgen/network/members)

</div>
