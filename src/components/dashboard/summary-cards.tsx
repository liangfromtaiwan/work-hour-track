"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SummaryCardsProps {
  usedHours: number;
  yearHours: number;
  currentYear: number;
  entryCount: number;
}

export function SummaryCards({
  usedHours,
  yearHours,
  currentYear,
  entryCount,
}: SummaryCardsProps) {
  const cards = [
    {
      key: "hours",
      title: "Hours this month",
      value: usedHours.toFixed(1),
      sub: "logged hours",
    },
    {
      key: "year-hours",
      title: "Hours this year",
      value: yearHours.toFixed(1),
      sub: `${currentYear} logged hours`,
    },
    {
      key: "entries",
      title: "Entries this month",
      value: String(entryCount),
      sub: entryCount === 1 ? "time entry" : "time entries",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.key} size="sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums tracking-tight">
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
