import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const patient = user;

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
          axios.get("/api/doctors"),
          axios.get("/api/patient/appointments"),
          axios.get("/api/patient/stats"),
          axios.get("/api/specializations"),
        ]);

        setDoctors(doctorsRes.data || []);
        setAppointments(appointmentsRes.data || []);
        setStats(statsRes.data);
        setSpecializations(specializationRes.data || []);
      } catch (error) {
        console.error("Failed to load patient dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      selectedSpecialization === "all" ||
      doctor.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

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
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Hello, {patient?.fullName?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            How are you feeling today? Let's find you a doctor.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "doctors", label: "Find Doctors" },
            { id: "appointments", label: "My Appointments" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* ================= OVERVIEW ================= */}
        {activeTab === "overview" && stats && (
          <div className="animate-fade-in">
            <div className="mb-8 grid gap-6 sm:grid-cols-3">
              <StatCard
                title="Upcoming Appointments"
                value={stats.upcomingAppointments}
                icon={Clock}
              />
              <StatCard
                title="Completed Visits"
                value={stats.completedAppointments}
                icon={CalendarCheck}
              />
              <StatCard
                title="Favorite Doctors"
                value={stats.favoritesDoctors}
                icon={Heart}
              />
            </div>

            {/* Featured Doctors */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Top Doctors
                </h2>
                <Button variant="ghost" onClick={() => setActiveTab("doctors")}>
                  View All
                </Button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {doctors.slice(0, 3).map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= DOCTORS ================= */}
        {activeTab === "doctors" && (
          <div className="animate-fade-in">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11"
                />
              </div>

              <Select
                value={selectedSpecialization}
                onValueChange={setSelectedSpecialization}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">
                No doctors found.
              </p>
            )}
          </div>
        )}

        {/* ================= APPOINTMENTS ================= */}
        {activeTab === "appointments" && (
          <div className="animate-fade-in">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-6 text-xl font-semibold text-foreground">
                Your Appointments
              </h2>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    viewAs="patient"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
