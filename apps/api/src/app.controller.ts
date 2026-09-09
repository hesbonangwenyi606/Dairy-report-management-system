import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): Record<string, unknown> {
    return this.appService.getHealth();
  }

  @Get('summary')
  getSummary(): Record<string, number> {
    return this.appService.getSummary();
  }

  @Get('projects')
  getProjects(): any[] {
    return this.appService.getProjects();
  }

  @Post('projects')
  createProject(@Body() payload: any): any {
    return this.appService.createProject(payload);
  }

  @Get('workers')
  getWorkers(): any[] {
    return this.appService.getWorkers();
  }

  @Post('workers')
  createWorker(@Body() payload: any): any {
    return this.appService.createWorker(payload);
  }

  @Get('attendance')
  getAttendance(): any[] {
    return this.appService.getAttendance();
  }

  @Post('attendance')
  createAttendance(@Body() payload: any): any {
    return this.appService.createAttendance(payload);
  }

  @Get('daily-reports')
  getDailyReports(): any[] {
    return this.appService.getDailyReports();
  }

  @Post('daily-reports')
  createDailyReport(@Body() payload: any): any {
    return this.appService.createDailyReport(payload);
  }

  @Get('materials')
  getMaterials(): any[] {
    return this.appService.getMaterials();
  }

  @Post('materials')
  createMaterial(@Body() payload: any): any {
    return this.appService.createMaterial(payload);
  }

  @Get('audit-logs')
  getAuditLogs(): any[] {
    return this.appService.getAuditLogs();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
