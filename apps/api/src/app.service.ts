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
