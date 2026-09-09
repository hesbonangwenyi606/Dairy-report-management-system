# System Architecture

## Overview
The system is structured as a scalable, multi-project platform centered on projects, assignments, roles, workflows, and analytics. The monorepo starter combines a Next.js frontend, a NestJS backend, Prisma ORM, and PostgreSQL.

## Component layout
- Web app: Next.js frontend for Admin, Project Manager, and Supervisor experience
- API: NestJS REST API enforcing authorization, validation, and role-based actions
- Shared package: reusable types, DTOs, enums, and common constants
- Database: PostgreSQL with Prisma models for projects, users, workers, attendance, reports, materials, equipment, issues, and audit logs
- Storage: S3-compatible or Cloudinary-style object storage for photos and documents
- Email and notifications: SES/SendGrid/SMTP integration
- PDF generation: server-side report rendering

## Vertical slices
### 1. Identity and access
- Users
- Roles
- Permissions
- Project assignments
- Authentication and password reset flows

### 2. Project operations
- Project creation, status changes, lifecycle management
- Project team management
- Site progress and diary updates
- Documents and file links

### 3. Workforce operations
- Workers
- Worker rates and rate history
- Attendance
- Working hours
- Labour approval
- Labour analytics

### 4. Site reporting
- Daily reports
- Site diaries
- Photos
- Progress entries
- Issues and safety records

### 5. Materials and procurement
- Material requests
- Purchase orders
- Receiving and inventory
- Inventory ledger and stock transfers

### 6. Financial management
- Budgets
- Expenses
- Labour, materials, and equipment cost mapping
- Variations and forecasting

## Permission model
Project-scoped authorization should be enforced in the API layer using a route guard or policy service. A role may have broad access at the platform level, but project data access should always be checked against the assigned project relationship.

## Suggested flow
1. Admin creates project.
2. Admin assigns supervisor and team.
3. Assignment event generates notification email.
4. Supervisor logs in and sees only assigned projects.
5. Supervisor records attendance, hours, material usage, photos, issues, progress, and daily reports.
6. Project Manager or Admin approves report and labour entries.
7. Approved data flows into analytics, documents, budgets, and PDF exports.

## Data principles
- Store immutable historical rates for labour correctness.
- Preserve audit events for user actions and system automation.
- Use transaction-safe inventory updates.
- Keep generated reports archive-ready and linked to the relevant project and date.
