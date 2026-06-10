

import { format } from "date-fns";
import {

  Calendar,
} from "lucide-react";

import Analytics from "./components/analytics";
import Orders from "./components/Orders";

export default function Dashboard() {

  return (
    <div className="flex-1 space-y-4 px-4 md:px-4 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            Today - {format(new Date(), "MMM dd, yyyy")}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <Analytics />

      <Orders />
    </div>
  );
}
