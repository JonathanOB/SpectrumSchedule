import { CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressWidgetProps {
  completed: number;
  total: number;
  label?: string;
}

export function ProgressWidget({ completed, total, label = "Today's tasks" }: ProgressWidgetProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-4xl font-bold text-foreground">{pct}%</span>
          <span className="text-sm text-muted-foreground mb-1">
            {completed} of {total} done
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-3 bg-muted rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% complete`}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Task breakdown */}
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
            {completed} completed
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Circle className="size-4 text-muted-foreground" aria-hidden="true" />
            {total - completed} remaining
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
