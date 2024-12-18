import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

export function StatsCard({ title, value, description, className }: StatsCardProps) {
  return (
    <Card className={cn("bg-dashboard-card p-6", className)}>
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-white">{value}</p>
        {description && (
          <p className="ml-2 flex items-baseline text-sm text-gray-400">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}