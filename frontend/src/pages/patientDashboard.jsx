import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api";

import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import DoctorCard from "@/components/doctors/DoctorCard";

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
  Clock,
  Heart,
  Search,
  Filter,
} from "lucide-react";

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          doctorsRes,
          appointmentsRes,
          statsRes,
          specializationRes,
        ] = await Promise.all([
          api.get("/api/doctors"),
          api.get("/api/patient/appointments"),
          api.get("/api/patient/stats"),
          api.get("/api/specializations"),
        ]);

        setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : []);
        setAppointments(
          Array.isArray(appointmentsRes.data)
            ? appointmentsRes.data
            : []
        );
        setStats(statsRes.data || null);
        setSpecializations(
          Array.isArray(specializationRes.data)
            ? specializationRes.data
            : []
        );

      } catch (error) {
        console.error("Dashboard Load Error:", error);

        // 🔥 If token expired or unauthorized → logout
        if (error.response?.status === 401) {
          logout();
          window.location.href = "/login";
        }

      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor?.specialization
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      selectedSpecialization === "all" ||
      doctor?.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Hello, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your appointments and find doctors easily.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {["overview", "doctors", "appointments"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* ================= OVERVIEW ================= */}
        {activeTab === "overview" && stats && (
          <div className="grid gap-6 sm:grid-cols-3">
            <StatCard
              title="Upcoming Appointments"
              value={stats?.upcomingAppointments || 0}
              icon={Clock}
            />
            <StatCard
              title="Completed Visits"
              value={stats?.completedAppointments || 0}
              icon={CalendarCheck}
            />
            <StatCard
              title="Favorite Doctors"
              value={stats?.favoritesDoctors || 0}
              icon={Heart}
            />
          </div>
        )}

        {/* ================= DOCTORS ================= */}
        {activeTab === "doctors" && (
          <>
            <div className="mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  className="pl-10"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={selectedSpecialization}
                onValueChange={setSelectedSpecialization}
              >
                <SelectTrigger className="w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {specializations.map((spec, index) => (
                    <SelectItem key={index} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <p className="text-center py-10 text-muted-foreground">
                No doctors found.
              </p>
            )}
          </>
        )}

        {/* ================= APPOINTMENTS ================= */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  viewAs="patient"
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No appointments found.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
