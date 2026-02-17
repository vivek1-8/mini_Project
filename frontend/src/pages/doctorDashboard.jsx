import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";

import {
  CalendarCheck,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const doctor = user;

  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, appointmentsRes] = await Promise.all([
          axios.get("/api/doctor/stats"),
          axios.get("/api/doctor/today-appointments"),
        ]);

        setStats(statsRes.data);
        setTodayAppointments(appointmentsRes.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {doctor?.fullName?.split(" ")[0] || "Doctor"}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening with your appointments today.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Appointments"
              value={stats.totalAppointments}
              icon={CalendarCheck}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Today's Patients"
              value={stats.todayPatients}
              icon={Users}
            />
            <StatCard
              title="Upcoming"
              value={stats.upcomingAppointments}
              icon={Clock}
            />
            <StatCard
              title="Monthly Earnings"
              value={`$${stats.monthlyEarnings.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: 8, isPositive: true }}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Today's Appointments
                </h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {todayAppointments.length} scheduled
                </span>
              </div>

              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    viewAs="doctor"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-4">
                <img
                  src={
                    doctor?.profileImage ||
                    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
                  }
                  alt={doctor?.fullName}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {doctor?.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {doctor?.specialization}
                  </p>
                  <p className="text-sm text-primary">
                    {doctor?.clinicName}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {doctor?.rating || 4.9}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {doctor?.totalPatients || "2,500"}
                  </p>
                  <p className="text-xs text-muted-foreground">Patients</p>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Weekly Revenue
                </h3>
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>

              <div className="flex h-32 items-end justify-between gap-2">
                {[40, 65, 50, 80, 60, 90, 75].map((height, i) => (
                  <div
                    key={i}
                    className="w-full rounded-t-md gradient-primary"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
