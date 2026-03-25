import prisma from "@/lib/db";

async function main() {
  console.log("🌱 Seeding tasks...");

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Define Database Schema",
        description: "Create Prisma schema for Agents, Tasks, Costs, Memories with proper relationships and constraints",
        status: "in_progress",
        priority: "high",
        dueDate: new Date("2026-03-02"),
        assignedTo: "Rex",
      },
      {
        title: "Install Prisma & Configure",
        description: "Set up Prisma ORM with SQLite for local development and testing",
        status: "in_progress",
        priority: "high",
        dueDate: new Date("2026-03-02"),
        assignedTo: "Rex",
      },
      {
        title: "Setup shadcn/ui Components",
        description: "Initialize shadcn/ui and install required components for the UI",
        status: "in_progress",
        priority: "medium",
        dueDate: new Date("2026-03-02"),
        assignedTo: "Rex",
      },
      {
        title: "Create Dashboard Layout",
        description: "Build main layout with header, sidebar, and stat cards",
        status: "in_progress",
        priority: "medium",
        dueDate: new Date("2026-03-02"),
        assignedTo: "Rex",
      },
      {
        title: "Build API Routes",
        description: "Create REST API endpoints for CRUD operations",
        status: "in_review",
        priority: "low",
        dueDate: new Date("2026-03-05"),
        assignedTo: "Rex",
      },
      {
        title: "Build Mission Control Dashboard",
        description: "Create the main operational dashboard with agent health, costs, and tasks",
        status: "todo",
        priority: "high",
        dueDate: null,
        assignedTo: null,
      },
      {
        title: "Setup Cost Tracking System",
        description: "Implement cost tracking with Prisma database and reporting",
        status: "todo",
        priority: "medium",
        dueDate: null,
        assignedTo: null,
      },
    ],
  });

  console.log("✅ Seeding complete! 7 tasks created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
