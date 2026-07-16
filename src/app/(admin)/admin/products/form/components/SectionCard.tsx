import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
export default function SectionCard({
  icon,
  title,
  description,
  children,
  collapsible = false,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Card className="py-5 shadow-none">
      <CardHeader
        className={`pb-3 ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-slate-100 text-slate-600">
              {icon}
            </span>
            <div>
              <CardTitle className="text-sm font-semibold text-primary">
                {title}
              </CardTitle>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              )}
            </div>
          </div>
          {collapsible && (
            <span className="text-slate-400">
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          )}
        </div>
      </CardHeader>
      {open && (
        <CardContent className="pt-0 space-y-4">{children}</CardContent>
      )}
    </Card>
  );
}