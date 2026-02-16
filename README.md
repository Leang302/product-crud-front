<<<<<<< HEAD
# HRD Portal - School Management System

A comprehensive school management system built with Next.js 14+, React, TypeScript, TailwindCSS, and ShadCN/UI.

## 🚀 Features

### Authentication

- **Login System**: Secure user authentication with email/password
- **Forgot Password**: OTP-based password recovery
- **Change Password**: Secure password update functionality

### User Management

- **Role-based Access**: Admin, Teacher, Student roles
- **User CRUD**: Create, read, update, delete users
- **Excel Import**: Bulk user import functionality
- **Search & Filter**: Advanced filtering and search capabilities

### Task Management

- **Task CRUD**: Complete task lifecycle management
- **Assignment Tracking**: Monitor student submissions
- **Deadline Management**: Track and manage task deadlines
- **Status Updates**: Real-time task status tracking

### Class Management

- **Class Assignment**: Assign teachers to classes
- **Calendar Integration**: View class schedules
- **Task Filtering**: Filter tasks by class and teacher

### Generation Management

- **Generation Tracking**: Manage student generations
- **Class Organization**: Organize classes by generation
- **Active Status**: Track active vs inactive generations

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **UI Components**: ShadCN/UI
- **State Management**: Zustand
- **Validation**: Zod
- **Icons**: Lucide React
- **Forms**: React Hook Form

## 📁 Project Structure

```
app/
├── (auth)/                 # Authentication pages
│   └── login/
├── (dashboard)/            # Protected dashboard pages
│   ├── dashboard/
│   ├── generation/
│   ├── classroom/
│   ├── department/
│   ├── staff/
│   └── task/
├── components/
│   ├── ui/                 # ShadCN/UI components
│   └── layout/             # Layout components
├── lib/                    # Utility functions
├── store/                  # Zustand stores
├── types/                  # TypeScript type definitions
└── globals.css
```

## 🎨 Design System

The application follows a consistent design system based on the provided mockups:

- **Color Palette**: Blue primary (#0B69FF), green success, gray neutrals
- **Typography**: Inter font family with clear hierarchy
- **Spacing**: Consistent padding and margins using TailwindCSS
- **Components**: Rounded corners, subtle shadows, hover effects
- **Layout**: Sidebar navigation with main content area

## 🚦 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Responsive Design

The application is fully responsive and works across:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔐 Authentication Flow

1. **Login**: Users authenticate with email/password
2. **Role-based Access**: Different views based on user role
3. **Session Management**: Persistent login state
4. **Password Recovery**: OTP-based password reset

## 📊 State Management

The application uses Zustand for state management with separate stores for:

- **Auth Store**: User authentication state
- **Task Store**: Task management and filtering
- **Generation Store**: Generation data management
- **Class Store**: Classroom management

## 🎯 Key Pages

### Dashboard

- Overview statistics
- Recent tasks
- Upcoming events
- Quick actions

### Task Management

- Task listing with filters
- Create/edit tasks
- Status tracking
- Deadline management

### Generation Management

- Generation cards grid
- Active/inactive status
- Class organization
- Date range tracking

### User Management

- Staff directory
- Department organization
- Contact information
- Role management

## 🔧 Development

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **No `any` types**: Strict typing throughout

### Component Guidelines

- **Reusable**: Self-contained components
- **Accessible**: WCAG 2.1 compliance
- **Documented**: Clear prop interfaces
- **Tested**: Unit and integration tests

## 🚀 Deployment

The application is ready for deployment on:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 📝 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
=======
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
>>>>>>> a698cf1706ab529417407eff2adeaf11cf34522d
