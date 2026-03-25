# Mission Control — Hit Network AI Operations

Central command center for managing AI agents, tasks, costs, and knowledge base.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mission-control/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Dashboard
│   │   ├── tasks/        # Tasks Kanban
│   │   ├── agents/       # Agent Health Monitor
│   │   ├── costs/        # Cost Tracking
│   │   ├── memory/       # Knowledge Base
│   │   ├── calendar/     # Event Calendar
│   │   └── api/          # API Routes
│   ├── components/       # UI Components (shadcn/ui)
│   └── lib/              # Utilities & database
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## 🗄️ Database

SQLite database with Prisma ORM. Schema includes:
- **Agent**: AI agent instances
- **Task**: Kanban tasks
- **Cost**: Spending tracking
- **Memory**: Knowledge base entries

## 🔧 Development

```bash
# Watch mode
npm run dev

# Type check
npm run type-check

# Format code
npm run format

# Lint code
npm run lint
```

## 🌐 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Tailscale Access

1. Install Tailscale: https://tailscale.com
2. Run: `tailscale up`
3. Share app: `ssh -L 3000:localhost:3000 user@tailscale-ip`

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite + Prisma ORM
- **UI**: shadcn/ui + Lucide icons
- **Charts**: Recharts
- **State**: TanStack Query

## 📊 Features

- **Dashboard**: Overview stats and activity feed
- **Tasks**: Kanban board with drag-and-drop
- **Agents**: Health monitoring for AI agents
- **Costs**: Financial tracking with charts
- **Memory**: Searchable knowledge base
- **Calendar**: Event scheduling with color coding

## 📝 Configuration

Environment variables (in `.env`):

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit PR

## 📄 License

MIT License - Hit Network 2026
