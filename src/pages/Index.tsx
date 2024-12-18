import { DashboardSidebar } from "@/components/DashboardSidebar";
import { StatsCard } from "@/components/StatsCard";

const Index = () => {
  return (
    <div className="flex bg-dashboard-background min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Orders"
            value="24"
            description="+4.3% from last hour"
            className="border-l-4 border-dashboard-accent1"
          />
          <StatsCard
            title="Completed Today"
            value="156"
            description="92% completion rate"
            className="border-l-4 border-dashboard-accent2"
          />
          <StatsCard
            title="Average Time"
            value="18m"
            description="2m faster than target"
            className="border-l-4 border-dashboard-accent1"
          />
          <StatsCard
            title="Revenue Today"
            value="$3,429"
            description="+12% from yesterday"
            className="border-l-4 border-dashboard-accent2"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dashboard-card rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
            {/* Add order list here in next iteration */}
          </div>
          <div className="bg-dashboard-card rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Performance Chart</h2>
            {/* Add chart here in next iteration */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;