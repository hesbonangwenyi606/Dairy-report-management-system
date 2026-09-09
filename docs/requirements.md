# Construction Site Management & Daily Reporting System - Requirements

## 1. Product scope
This repository contains a structured starter implementation for a construction site management and daily reporting system that aligns with the proposal provided by the user. It includes a monorepo foundation using Next.js, NestJS, Prisma, PostgreSQL, and a shared package for cross-app types.

## 2. Core modules
- Admin dashboard
- Project/site management
- Project lifecycle and assignment
- Supervisor dashboard
- Workers and worker rates
- Attendance and working hours
- Labour cost calculation and approval
- Daily reports and PDF-ready reports
- Site diary
- Materials, inventory, and requests
- Equipment, fuel, maintenance
- Issues, safety, schedules, milestones
- Suppliers, procurement, BOQs, variations
- Budgets, expenses, and documents
- Notifications, email automation, analytics, and audit logs

## 3. Role-based access
- Admin: full access to all projects, system configuration, budgets, approvals, analytics, and audit logs.
- Project Manager: view and review assigned projects, schedules, progress, documents, safety, and reports.
- Supervisor: access only assigned projects and their operational workflow such as attendance, hours, materials, issues, photos, and daily report submission.
- Storekeeper: manage inventory movements, receiving, issuing, damaged stock, and stock transfers.
- Accountant / Finance User: review labour, expenses, suppliers, budgets, and financial reports.
- Safety Officer: manage safety records, incidents, inspections, and corrective actions.

## 4. Functional requirements
### Project creation and assignment
- Admin creates a project with project metadata, lifecycle status, budget values, and assigned team.
- Supervisor assignment creates a project assignment record and triggers an automated email event.
- Project access is scoped by assignment records and enforced through API authorization.

### Attendance and labour
- Worker attendance is tracked by date and project.
- Clock-in / clock-out or manual hours can be stored.
- The system calculates regular labour, overtime labour, and total labour.
- Historical worker rates are preserved for every labour calculation.
- Labour approval workflow prevents unauthorized financial changes.

### Daily reports
- Supervisors can create and submit daily reports.
- Reports include attendance summaries, hours, labour, materials, equipment, issues, safety, visitors, photos, and remarks.
- Admin or Project Manager review and approve or reject reports.
- Approved reports can be published as PDF-friendly outputs.

### Materials and inventory
- Materials can be requested, approved, purchased, delivered, received, stored, issued, and used.
- Opening stock, received stock, returned stock, transferred stock, damaged stock, and used stock reconcile into closing stock.

### Safety, issues, and progress
- Issues can be logged and tracked by category, priority, and status.
- Safety incidents and inspections are captured and linked to projects.
- Progress can be tracked by stage and milestone coverage.

## 5. Non-functional requirements
- Secure authentication and authorization
- Project-by-project access control
- API validation and logging
- Audit trails for material changes, approvals, and user activity
- File and document storage for photos, site files, BOQs, and reports
- Mobile-first supervisor workflows and offline-ready design support
- Backup, retention, and disaster recovery planning

## 6. Suggested acceptance criteria
- Admin can create a project and assign supervisors.
- Assigned supervisors can only access authorized projects.
- Worker rates and approved hours produce correct labour entries.
- Historical worker rate changes do not alter previously approved labour calculations.
- Materials transaction records correctly update inventory balances.
- Daily reports can be submitted, reviewed, approved, and archived.
- Admin receives generated notifications for critical events.
- The platform preserves a complete audit trail for key actions.

## 7. Roadmap
### Phase 1
- Authentication, users, roles, and project assignments
- Worker management, attendance, hours, labour calculation, and approvals
- Daily reports, report approval, PDF-ready exports, and audit history
- Materials, inventory, photos, issues, and progress

### Phase 2
- Equipment, fuel, suppliers, procurement, expenses, budgets, documents, safety, BOQ, schedules, milestones, and subcontractors

### Phase 3
- WhatsApp/SMS notifications, offline sync, client portal, forecasting, AI-assisted summaries, and advanced analytics
