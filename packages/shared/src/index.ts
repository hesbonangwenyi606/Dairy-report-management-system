export type RoleName = 'admin' | 'project_manager' | 'supervisor' | 'storekeeper' | 'finance' | 'safety_officer';

export type ProjectStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'archived';

export interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  location: string;
  status: ProjectStatus;
  progress: number;
}

export interface LabourCalculationInput {
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
}

export interface LabourCalculationResult {
  regularLabour: number;
  overtimeLabour: number;
  totalLabour: number;
}

export const systemModules = [
  'Admin Dashboard',
  'Projects/Sites',
  'Client Management',
  'Worker Management',
  'Attendance',
  'Working Hours',
  'Labour Costs',
  'Daily Reports',
  'Materials',
  'Inventory',
  'Equipment',
  'Fuel',
  'Procurement',
  'Suppliers',
  'Subcontractors',
  'BOQ',
  'Variations',
  'Expenses',
  'Budgets',
  'Issues',
  'Safety',
  'Schedules',
  'Milestones',
  'Documents',
  'Progress',
  'Analytics',
  'PDF Reports',
  'Notifications',
  'Audit Logs',
];
