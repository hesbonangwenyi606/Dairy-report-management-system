import { Injectable } from '@nestjs/common';

interface BaseRecord {
  id: string;
  createdAt: string;
}

interface Project extends BaseRecord {
  name: string;
  code: string;
  location: string;
  status: string;
  progress: number;
  supervisor: string;
}

interface Worker extends BaseRecord {
  fullName: string;
  role: string;
  phone: string;
  projectCode: string;
  status: string;
}

interface AttendanceEntry extends BaseRecord {
  workerName: string;
  projectCode: string;
  date: string;
  status: string;
  notes?: string;
}

interface DailyReport extends BaseRecord {
  reportNumber: string;
  projectCode: string;
  date: string;
  workersPresent: number;
  totalHours: number;
  status: string;
}

interface Material extends BaseRecord {
  name: string;
  projectCode: string;
  quantity: number;
  unit: string;
  supplier: string;
  condition: string;
}

interface EquipmentRecord extends BaseRecord {
  name: string;
  projectCode: string;
  condition: string;
  operator: string;
  lastMaintenance: string;
}

interface SafetyRecord extends BaseRecord {
  title: string;
  projectCode: string;
  severity: string;
  status: string;
  description: string;
  location?: string;
  actions?: string;
  reportedBy?: string;
}

interface BudgetEntry extends BaseRecord {
  projectCode: string;
  category: string;
  planned: number;
  spent: number;
  status: string;
  amount?: number;
}

interface ProcurementEntry extends BaseRecord {
  item: string;
  projectCode: string;
  supplier: string;
  amount: number;
  status: string;
  vendor?: string;
  quantity?: number;
}

interface AuditLog extends BaseRecord {
  action: string;
  details: string;
  projectCode?: string;
}

@Injectable()
export class AppService {
  private readonly projects: Project[] = [
    {
      id: 'proj-1001',
      name: 'North Ridge Residences',
      code: 'NRR-01',
      location: 'Kigali',
      status: 'Active',
      progress: 68,
      supervisor: 'A. Niyonsaba',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'proj-1002',
      name: 'Waterline Utilities',
      code: 'WLU-02',
      location: 'Musanze',
      status: 'On Hold',
      progress: 42,
      supervisor: 'M. Teta',
      createdAt: new Date().toISOString(),
    },
  ];

  private readonly workers: Worker[] = [
    {
      id: 'wrk-1001',
      fullName: 'Eric Mukiza',
      role: 'Supervisor',
      phone: '+250788111111',
      projectCode: 'NRR-01',
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'wrk-1002',
      fullName: 'Grace Uwimana',
      role: 'Carpenter',
      phone: '+250788222222',
      projectCode: 'NRR-01',
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
  ];

  private readonly attendance: AttendanceEntry[] = [
    {
      id: 'att-1001',
      workerName: 'Eric Mukiza',
      projectCode: 'NRR-01',
      date: '2026-09-09',
      status: 'Present',
      notes: 'Site inspection completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'att-1002',
      workerName: 'Grace Uwimana',
      projectCode: 'NRR-01',
      date: '2026-09-09',
      status: 'Present',
      notes: 'Worked on formwork',
      createdAt: new Date().toISOString(),
    },
  ];

  private readonly dailyReports: DailyReport[] = [
    {
      id: 'rep-1001',
      reportNumber: 'DR-2026-009',
      projectCode: 'NRR-01',
      date: '2026-09-09',
      workersPresent: 18,
      totalHours: 144,
      status: 'Approved',
      createdAt: new Date().toISOString(),
    },
  ];

  private readonly materials: Material[] = [
    {
      id: 'mat-1001',
      name: 'Cement Bags',
      projectCode: 'NRR-01',
      quantity: 120,
      unit: 'bags',
      supplier: 'Elite Build Supplies',
      condition: 'Good',
      createdAt: new Date().toISOString(),
    },
  ];

  private readonly equipment: EquipmentRecord[] = [
    {
      id: 'eq-1001',
      name: 'Excavator 305',
      projectCode: 'NRR-01',
      condition: 'Operational',
      operator: 'M. Hake',
      lastMaintenance: '2026-09-05',
      createdAt: new Date().toISOString(),
    },
  ];

  private readonly safetyRecords: SafetyRecord[] = [
    {
      id: 'safety-1001',
      title: 'Scaffolding Inspection',
      projectCode: 'NRR-01',
      severity: 'High',
      status: 'Open',
      description: 'Weekly scaffolding inspection required before concrete deck work.',
      createdAt: new Date().toISOString(),
    },
  ];

  private readonly budgets: BudgetEntry[] = [
    {
      id: 'budget-1001',
      projectCode: 'NRR-01',
      category: 'Labour',
      planned: 260000,
      spent: 188000,
      status: 'On Track',
      createdAt: new Date().toISOString(),
    },
  ];

  private readonly procurement: ProcurementEntry[] = [
    {
      id: 'proc-1001',
      item: 'Steel Rods',
      projectCode: 'NRR-01',
      supplier: 'BuildCore Traders',
      amount: 42000,
      status: 'Approved',
      createdAt: new Date().toISOString(),
    },
  ];

  private readonly auditLogs: AuditLog[] = [
    {
      id: 'log-1001',
      action: 'Project Created',
      details: 'North Ridge Residences project added to the system',
      projectCode: 'NRR-01',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'log-1002',
      action: 'Attendance Updated',
      details: 'Worker attendance recorded for 2026-09-09',
      projectCode: 'NRR-01',
      createdAt: new Date().toISOString(),
    },
  ];

  getHello(): string {
    return 'Construction Site Management API is running.';
  }

  getHealth(): Record<string, unknown> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  getSummary() {
    return {
      projects: this.projects.length,
      workers: this.workers.length,
      attendance: this.attendance.length,
      reports: this.dailyReports.length,
      materials: this.materials.length,
      equipment: this.equipment.length,
      safety: this.safetyRecords.length,
      budgets: this.budgets.length,
      procurement: this.procurement.length,
      alerts: this.auditLogs.length,
    };
  }

  getProjects() {
    return this.projects;
  }

  createProject(payload: Partial<Project>) {
    const project = {
      id: `proj-${Date.now()}`,
      name: payload.name ?? 'New Project',
      code: payload.code ?? `PRJ-${Date.now().toString().slice(-4)}`,
      location: payload.location ?? 'Unassigned',
      status: payload.status ?? 'Draft',
      progress: payload.progress ?? 0,
      supervisor: payload.supervisor ?? 'Unassigned',
      createdAt: new Date().toISOString(),
    };

    this.projects.unshift(project);
    this.addAuditLog('Project Created', `Project ${project.code} created`, project.code);

    return project;
  }

  getWorkers() {
    return this.workers;
  }

  createWorker(payload: Partial<Worker>) {
    const worker = {
      id: `wrk-${Date.now()}`,
      fullName: payload.fullName ?? 'New Worker',
      role: payload.role ?? 'Worker',
      phone: payload.phone ?? '',
      projectCode: payload.projectCode ?? 'NRR-01',
      status: payload.status ?? 'Active',
      createdAt: new Date().toISOString(),
    };

    this.workers.unshift(worker);
    this.addAuditLog('Worker Added', `Worker ${worker.fullName} added to project ${worker.projectCode}`);

    return worker;
  }

  getAttendance() {
    return this.attendance;
  }

  createAttendance(payload: Partial<AttendanceEntry>) {
    const attendance = {
      id: `att-${Date.now()}`,
      workerName: payload.workerName ?? 'Unknown Worker',
      projectCode: payload.projectCode ?? 'NRR-01',
      date: payload.date ?? new Date().toISOString().slice(0, 10),
      status: payload.status ?? 'Present',
      notes: payload.notes ?? '',
      createdAt: new Date().toISOString(),
    };

    this.attendance.unshift(attendance);
    this.addAuditLog('Attendance Recorded', `${attendance.workerName} marked ${attendance.status}`, attendance.projectCode);

    return attendance;
  }

  getDailyReports() {
    return this.dailyReports;
  }

  createDailyReport(payload: Partial<DailyReport>) {
    const report = {
      id: `rep-${Date.now()}`,
      reportNumber: payload.reportNumber ?? `DR-${Date.now().toString().slice(-6)}`,
      projectCode: payload.projectCode ?? 'NRR-01',
      date: payload.date ?? new Date().toISOString().slice(0, 10),
      workersPresent: payload.workersPresent ?? 0,
      totalHours: payload.totalHours ?? 0,
      status: payload.status ?? 'Draft',
      createdAt: new Date().toISOString(),
    };

    this.dailyReports.unshift(report);
    this.addAuditLog('Daily Report Created', `Report ${report.reportNumber} created`, report.projectCode);

    return report;
  }

  getMaterials() {
    return this.materials;
  }

  createMaterial(payload: Partial<Material>) {
    const material = {
      id: `mat-${Date.now()}`,
      name: payload.name ?? 'New Material',
      projectCode: payload.projectCode ?? 'NRR-01',
      quantity: payload.quantity ?? 0,
      unit: payload.unit ?? 'pcs',
      supplier: payload.supplier ?? 'Unassigned',
      condition: payload.condition ?? 'Good',
      createdAt: new Date().toISOString(),
    };

    this.materials.unshift(material);
    this.addAuditLog('Material Added', `Material ${material.name} added`, material.projectCode);

    return material;
  }

  getAuditLogs() {
    return this.auditLogs;
  }

  getEquipment() {
    return this.equipment;
  }

  createEquipment(payload: Partial<EquipmentRecord>) {
    const equipment = {
      id: `eq-${Date.now()}`,
      name: payload.name ?? 'New Equipment',
      projectCode: payload.projectCode ?? 'NRR-01',
      condition: payload.condition ?? 'Operational',
      operator: payload.operator ?? 'Unassigned',
      lastMaintenance: payload.lastMaintenance ?? new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };

    this.equipment.unshift(equipment);
    this.addAuditLog('Equipment Added', `Equipment ${equipment.name} added`, equipment.projectCode);

    return equipment;
  }

  getSafetyRecords() {
    return this.safetyRecords;
  }

  createSafetyRecord(payload: Partial<SafetyRecord>) {
    const location = payload.location ?? '';
    const actions = payload.actions ?? payload.description ?? '';
    const reportedBy = payload.reportedBy ?? '';

    const safety = {
      id: `safety-${Date.now()}`,
      title: payload.title ?? 'New Safety Record',
      projectCode: payload.projectCode ?? 'NRR-01',
      severity: payload.severity ?? 'Medium',
      status: payload.status ?? 'Open',
      description: actions,
      location,
      actions,
      reportedBy,
      createdAt: new Date().toISOString(),
    };

    this.safetyRecords.unshift(safety);
    this.addAuditLog('Safety Record Added', `Safety record ${safety.title} added`, safety.projectCode);

    return safety;
  }

  getBudgets() {
    return this.budgets;
  }

  createBudget(payload: Partial<BudgetEntry>) {
    const planned = payload.planned ?? payload.amount ?? 0;

    const budget = {
      id: `budget-${Date.now()}`,
      projectCode: payload.projectCode ?? 'NRR-01',
      category: payload.category ?? 'General',
      planned,
      spent: payload.spent ?? 0,
      amount: planned,
      status: payload.status ?? 'On Track',
      createdAt: new Date().toISOString(),
    };

    this.budgets.unshift(budget);
    this.addAuditLog('Budget Added', `Budget entry for ${budget.category} added`, budget.projectCode);

    return budget;
  }

  getProcurement() {
    return this.procurement;
  }

  createProcurement(payload: Partial<ProcurementEntry>) {
    const supplier = payload.supplier ?? payload.vendor ?? 'Unassigned';
    const amount = payload.amount ?? payload.quantity ?? 0;
    const quantity = payload.quantity ?? payload.amount ?? 0;

    const procurement = {
      id: `proc-${Date.now()}`,
      item: payload.item ?? 'New Procurement',
      projectCode: payload.projectCode ?? 'NRR-01',
      supplier,
      vendor: supplier,
      amount,
      quantity,
      status: payload.status ?? 'Pending',
      createdAt: new Date().toISOString(),
    };

    this.procurement.unshift(procurement);
    this.addAuditLog('Procurement Added', `Procurement request for ${procurement.item} added`, procurement.projectCode);

    return procurement;
  }

  private addAuditLog(action: string, details: string, projectCode?: string) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      action,
      details,
      projectCode,
      createdAt: new Date().toISOString(),
    });
  }
}
