"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTRACT_HOURS, MAX_HOURS } from "@/lib/constants";

interface SummaryCardsProps {
  usedHours: number;
  remainingContract: number;
  extraHoursUsed: number;
  remainingToMax: number;
}

export function SummaryCards({
  usedHours,
  remainingContract,
  extraHoursUsed,
  remainingToMax,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Used this month",
      value: usedHours.toFixed(1),
      sub: `of ${MAX_HOURS}h max`,
    },
    {
      title: "Remaining in contract",
      value: remainingContract.toFixed(1),
      sub: `of ${CONTRACT_HOURS}h`,
    },
    {
      title: "Extra hours used",
      value: extraHoursUsed.toFixed(1),
      sub: "over contract",
    },
    {
      title: "Remaining until max cap",
      value: remainingToMax.toFixed(1),
      sub: `of ${MAX_HOURS}h`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} size="sm">
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
