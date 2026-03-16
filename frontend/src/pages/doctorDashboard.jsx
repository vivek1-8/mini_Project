import React, { useEffect, useState } from "react";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";

import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CalendarCheck,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle,
  XCircle,
  Filter
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const doctor = user;

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  
  // Table State
  const [allAppointments, setAllAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, todayRes] = await Promise.all([
        api.get("/api/doctors/stats"),
        api.get("/api/doctors/today-appointments"),
      ]);
      setStats(statsRes.data);
      setTodayAppointments(todayRes.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      let query = "";
      if (searchTerm) query += `name=${searchTerm}&`;
      if (filterDate) query += `date=${filterDate}&`;
      if (filterStatus !== "all") query += `status=${filterStatus}&`;
      
      const res = await api.get(`/api/doctors/appointments?${query}`);
      setAllAppointments(res.data);
    } catch (error) {
      console.error("Appointments fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "appointments") {
      fetchAllAppointments();
    }
  }, [activeTab, searchTerm, filterDate, filterStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/api/appointments/${id}/status`, { status: newStatus });
      // Refresh data
      if (activeTab === "appointments") {
        fetchAllAppointments();
      }
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // Prepping Chart Data
  const weeklyData = [
    { name: 'Sun', appointments: stats?.chartData?.weekly[0] || 0 },
    { name: 'Mon', appointments: stats?.chartData?.weekly[1] || 0 },
    { name: 'Tue', appointments: stats?.chartData?.weekly[2] || 0 },
    { name: 'Wed', appointments: stats?.chartData?.weekly[3] || 0 },
    { name: 'Thu', appointments: stats?.chartData?.weekly[4] || 0 },
    { name: 'Fri', appointments: stats?.chartData?.weekly[5] || 0 },
    { name: 'Sat', appointments: stats?.chartData?.weekly[6] || 0 },
  ];

  const monthlyData = [
    { name: 'Completed', value: stats?.chartData?.monthly?.completed || 0 },
    { name: 'Pending', value: stats?.chartData?.monthly?.pending || 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            Welcome back, <span className="text-primary">{doctor?.fullName?.split(" ")[0] || "Doctor"}</span> 👋
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Here's a comprehensive overview of your practice, upcoming appointments, and financial statistics.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 inline-flex h-12 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground shadow-sm">
          {["overview", "appointments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm scale-100"
                  : "hover:bg-muted-foreground/10 scale-95 hover:scale-100 text-muted-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === "overview" && stats && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Bookings"
                value={stats.totalAppointments}
                icon={Users}
              />
              <StatCard
                title="Weekly Appointments"
                value={stats.weeklyPatients || 0}
                icon={CalendarCheck}
              />
              <StatCard
                title="Monthly Appointments"
                value={stats.monthlyPatients || 0}
                icon={CalendarCheck}
              />
              <StatCard
                title="Upcoming / Pending"
                value={stats.upcomingAppointments || 0}
                icon={Clock}
                className="bg-primary/5 border-primary/20"
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Daily Appointments Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">
                      Today's Schedule
                    </h2>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {todayAppointments.length} Today
                    </span>
                  </div>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {todayAppointments.length > 0 ? (
                      todayAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          viewAs="doctor"
                          onCancel={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          onConfirm={() => handleStatusUpdate(appointment.id, 'confirmed')}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed text-muted-foreground">
                         <p>No appointments scheduled for today.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Charts Column */}
              <div className="lg:col-span-2 space-y-6">
                 {/* Weekly Recharts */}
                 <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-6">Weekly Appointments Flow</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={weeklyData}>
                           <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                           <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                           <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                           <Bar dataKey="appointments" fill="var(--color-primary, #2563eb)" radius={[4, 4, 0, 0]} />
                         </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Monthly Recharts */}
                 <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-6">Monthly Completion Trend</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                           <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                           <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                           <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                           <Bar dataKey="value" fill="var(--color-primary, #3b82f6)" radius={[4, 4, 0, 0]} barSize={60} />
                         </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= APPOINTMENTS TAB ================= */}
        {activeTab === "appointments" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             
            {/* Filters Bar */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 bg-muted/50 p-4 rounded-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10 h-10 border-0 bg-background"
                  placeholder="Search by patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <input 
                  type="date"
                  className="flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px] h-10 bg-background border-0 focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-3xl border border-border/50 bg-card overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                     <tr>
                       <th className="px-6 py-4">Patient Name</th>
                       <th className="px-6 py-4">Contact</th>
                       <th className="px-6 py-4">Date & Time</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border/50">
                     {allAppointments.length > 0 ? (
                        allAppointments.map((app) => (
                           <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                              <td className="px-6 py-4 font-medium text-foreground">{app.patientName}</td>
                              <td className="px-6 py-4">
                                 <div>{app.patientEmail}</div>
                                 <div className="text-muted-foreground text-xs">{app.patientPhone || "N/A"}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <div>{app.date}</div>
                                 <div className="text-muted-foreground text-xs">{app.time}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${app.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                      app.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                      'bg-yellow-100 text-yellow-800'}`}>
                                    {app.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                 {['upcoming', 'pending'].includes(app.status) && (
                                    <>
                                       <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => handleStatusUpdate(app.id, 'completed')}>
                                          <CheckCircle className="mr-1 h-3 w-3" /> Complete
                                       </Button>
                                       <Button size="sm" variant="ghost" className="h-8 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleStatusUpdate(app.id, 'cancelled')}>
                                          <XCircle className="h-4 w-4" /> Reject
                                       </Button>
                                    </>
                                 )}
                                 {app.status === 'completed' && (
                                     <span className="text-muted-foreground italic text-xs">No actions</span>
                                 )}
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                              No appointments found matching your filters.
                           </td>
                        </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default DoctorDashboard;
