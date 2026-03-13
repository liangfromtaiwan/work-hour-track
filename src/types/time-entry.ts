export interface TimeEntry {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  taskTitle: string;
  hours: number;
  note?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface MonthYear {
  month: number; // 1-12
  year: number;
}

export interface TimeEntryFormData {
  date: string;
  taskTitle: string;
  hours: number;
  note?: string;
}
