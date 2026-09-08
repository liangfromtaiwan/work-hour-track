import { CircleHelp } from "lucide-react";

interface MonthlyHoursChartProps {
  year: number;
  monthlyHours: number[];
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WIDTH = 960;
const HEIGHT = 360;
const PLOT = { left: 52, right: 20, top: 28, bottom: 48 };
const plotWidth = WIDTH - PLOT.left - PLOT.right;
const plotHeight = HEIGHT - PLOT.top - PLOT.bottom;

function getScaleMax(values: number[]): number {
  const maxValue = Math.max(...values, 0);
  return maxValue === 0 ? 60 : Math.max(15, Math.ceil(maxValue / 15) * 15);
}

export function MonthlyHoursChart({ year, monthlyHours }: MonthlyHoursChartProps) {
  const values = MONTH_LABELS.map((_, index) => monthlyHours[index] ?? 0);
  const scaleMax = getScaleMax(values);
  const ticks = Array.from({ length: 5 }, (_, index) => (scaleMax / 4) * index);
  const columnWidth = plotWidth / values.length;
  const barWidth = columnWidth * 0.72;

  return (
    <section className="rounded-xl border bg-card p-4 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-xl font-semibold tracking-tight">Monthly analysis</h2>
        <CircleHelp
          className="size-4 text-muted-foreground"
          aria-label="Each bar shows the total logged hours for that month."
        />
      </div>

      <div className="overflow-x-auto">
        <svg
          className="min-w-[720px]"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby="monthly-chart-title monthly-chart-description"
        >
          <title id="monthly-chart-title">Monthly work hours for {year}</title>
          <desc id="monthly-chart-description">
            {values
              .map((hours, index) => `${MONTH_LABELS[index]}: ${hours.toFixed(1)} hours`)
              .join(", ")}
          </desc>

          {ticks.map((tick) => {
            const y = PLOT.top + plotHeight - (tick / scaleMax) * plotHeight;
            return (
              <g key={tick}>
                <line
                  x1={PLOT.left}
                  x2={WIDTH - PLOT.right}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-border"
                />
                <text
                  x={PLOT.left - 12}
                  y={y + 5}
                  textAnchor="end"
                  className="fill-muted-foreground text-sm"
                >
                  {Number.isInteger(tick) ? tick : tick.toFixed(1)}
                </text>
              </g>
            );
          })}

          {values.map((hours, index) => {
            const barHeight = (hours / scaleMax) * plotHeight;
            const x = PLOT.left + index * columnWidth + (columnWidth - barWidth) / 2;
            const y = PLOT.top + plotHeight - barHeight;
            const labelX = PLOT.left + index * columnWidth + columnWidth / 2;

            return (
              <g key={MONTH_LABELS[index]}>
                <title>{`${MONTH_LABELS[index]} ${year}: ${hours.toFixed(1)} hours`}</title>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  className="fill-teal-600"
                />
                {hours > 0 && (
                  <text
                    x={labelX}
                    y={Math.max(y - 8, 16)}
                    textAnchor="middle"
                    className="fill-foreground text-sm font-medium"
                  >
                    {hours.toFixed(1)}
                  </text>
                )}
                <text
                  x={labelX}
                  y={HEIGHT - 18}
                  textAnchor="middle"
                  className="fill-muted-foreground text-sm"
                >
                  {MONTH_LABELS[index]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
