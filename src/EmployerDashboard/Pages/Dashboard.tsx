import { useState, useEffect } from "react";
import Loading from "../Loading";
import EmployerDashboard from "../EmployerDashboard"; // rename EmployerDashboard → MemberDashboard

// Define a proper type for dashboard data
interface DashboardData {
  name: string;
  role: "ADMIN" | "EMPLOYER" | "MEMBER";
  Member?: { firstName: string };
  currentMonthContribution?: number;
  totalContributions?: number;
  totalClaims?: number;
  approvedClaims?: number;
  pendingClaims?: number;
  coverStatus?: string;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(null);
    setLoading(true);

    // Simulate API call
    const timer = setTimeout(() => {
      const role: DashboardData["role"] = "MEMBER"; // change to test: "ADMIN" | "EMPLOYER" | "MEMBER"

      const base: DashboardData = { name: "RobTech", role };

      const dashboardData: DashboardData =
        role === "MEMBER"
          ? {
              ...base,
              Member: { firstName: "Robtech" },
              currentMonthContribution: 150,
              totalContributions: 2500,
              totalClaims: 1200,
              approvedClaims: 10,
              pendingClaims: 2,
              coverStatus: "Active",
            }
          : base;

      setData(dashboardData);
      setLoading(false);
    }, 2000);

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;
  if (!data) return <p className="text-center text-slate-500 py-12">Failed to Load Dashboard</p>;

  if (data.role === "ADMIN") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome, {data.name}! Here you can manage users, view reports, and configure settings.</p>
      </div>
    );
  }

  if (data.role === "EMPLOYER") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Employer Dashboard</h1>
        <p>Welcome, {data.name}! Here you can manage employees and contributions.</p>
      </div>
    );
  }

  if (data.role === "MEMBER") {
    return <EmployerDashboard  data={data} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {data.name}! Here you can view your profile and manage your account.</p>
    </div>
  );
};

export default Dashboard;