# Task Manager

A modern task management application built with the T3 Stack (TypeScript, Next.js, tRPC, Prisma, PostgreSQL) with NextAuth.js authentication and Tailwind CSS styling.

## Features

### Task Management
- Create, read, update, and delete tasks
- Assign tasks to team members
- Set task deadlines
- Categorize tasks with priorities (Low, Medium, High, Urgent)
- Track task status (To Do, In Progress, In Review, Done, Archived)
- Add multiple tags to tasks
- View tasks by project

### User Profile & Settings
- Manage personal user information (name, email, phone, department)
- Set bio and profile preferences
- View user role and permissions
- Customize notification preferences

### Project Management
- Create and manage projects
- Add team members to projects
- Organize tasks within projects
- Project settings and configurations

### Authentication
- Secure authentication with NextAuth.js
- Demo user login (email: demo@example.com, password: demo)
- Session management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js, tRPC, Node.js
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form, Zod for validation
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+

### Installation

1. Clone the repository:
```bash
cd my-task
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your PostgreSQL connection string and NextAuth secret:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mytask"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a random secret for NextAuth:
```bash
openssl rand -base64 32
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

[https://dashboard-sandeep-s-projects27.vercel.app/](https://dashboard-sandeep-s-projects27.vercel.app/)

## Demo Credentials

- **Email**: demo@example.com
- **Password**: demo

## Project Structure

```
src/
  ├── pages/
  │   ├── api/
  │   │   ├── auth/[...nextauth].ts      # NextAuth API route
  │   │   └── trpc/[trpc].ts             # tRPC API route
  │   ├── dashboard/                      # Dashboard page
  │   ├── tasks/                          # Task management page
  │   ├── projects/                       # Projects page
  │   ├── profile/                        # User profile page
  │   ├── auth/                           # Authentication pages
  │   └── index.tsx                       # Home page
  ├── server/
  │   ├── api/
  │   │   ├── routers/
  │   │   │   ├── task.ts               # Task API routes
  │   │   │   ├── user.ts               # User API routes
  │   │   │   └── project.ts            # Project API routes
  │   │   ├── root.ts                   # Root tRPC router
  │   │   └── trpc.ts                   # tRPC context and middleware
  │   ├── auth.ts                        # NextAuth configuration
  │   ├── db.ts                          # Prisma client
  │   └── trpc.ts                        # tRPC initialization
  ├── styles/
  │   └── globals.css                    # Global Tailwind styles
  └── utils/
      └── trpc.ts                        # tRPC client utils
prisma/
  └── schema.prisma                      # Database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The application uses the following main models:

- **User**: User accounts with profile information
- **Task**: Tasks with status, priority, deadlines, and assignments
- **Project**: Projects that contain tasks and team members
- **ProjectMember**: Team members assigned to projects
- **Tag**: Tags for categorizing tasks
- **Account/Session**: NextAuth authentication records

## Error Handling

The application uses tRPC for type-safe API error handling and displays appropriate user feedback in the UI.

## Security

- Passwords are securely hashed
- Sessions are managed through NextAuth.js
- Environment variables are kept in `.env.local` (not committed to Git)
- CSRF protection is enabled by default

## Future Enhancements

- Real-time collaboration with WebSockets
- Task comments and activity monitoring
- File attachments for tasks
- Advanced filtering and search
- Team analytics and reporting
- Mobile app

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
