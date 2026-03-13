"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { MonthYear } from "@/types/time-entry";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonthOptions(count = 12): { value: string; label: string }[] {
  const now = new Date();
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const value = `${year}-${String(month).padStart(2, "0")}`;
    const label = `${MONTH_NAMES[d.getMonth()]} ${year}`;
    options.push({ value, label });
  }
  return options;
}

function parseValue(value: string): MonthYear {
  const [year, month] = value.split("-").map(Number);
  return { month, year };
}

interface MonthFilterProps {
  value: MonthYear;
  onChange: (monthYear: MonthYear) => void;
}

export function MonthFilter({ value, onChange }: MonthFilterProps) {
  const options = getMonthOptions();
  const valueStr = `${value.year}-${String(value.month).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-2">
      <Label>Month</Label>
      <Select
        value={valueStr}
        onValueChange={(v) => { if (typeof v === "string") onChange(parseValue(v)); }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
