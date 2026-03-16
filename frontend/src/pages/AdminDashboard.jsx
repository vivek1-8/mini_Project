import React, { useEffect, useState } from "react";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  UserPlus,
  DollarSign,
  Activity,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Stethoscope,
  TrendingUp,
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

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // States
  const [doctors, setDoctors] = useState([]);
  const [dailyPayments, setDailyPayments] = useState(0);
  const [weeklyData, setWeeklyData] = useState({ total: 0, chart: [] });
  const [monthlyData, setMonthlyData] = useState({ total: 0, completed: 0, pending: 0 });
  const [paymentHistory, setPaymentHistory] = useState([]);
  
  // Add Doctor Form State
  const [doctorForm, setDoctorForm] = useState({
    fullName: "",
    email: "",
    specialization: "",
    location: "",
    experience: "",
    fee: "",
    image: "",
  });
  const [newCredentials, setNewCredentials] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [
         docsRes, 
         dailyRes, 
         weeklyRes, 
         monthlyRes, 
         historyRes
      ] = await Promise.all([
        api.get("/api/admin/doctors"),
        api.get("/api/admin/daily-payments"),
        api.get("/api/admin/weekly-payments"),
        api.get("/api/admin/monthly-payments"),
        api.get("/api/admin/payment-history"),
      ]);

      setDoctors(docsRes.data);
      setDailyPayments(dailyRes.data.totalCollection);
      setWeeklyData({
         total: weeklyRes.data.totalCollection,
         chart: [
            { name: 'Sun', amount: weeklyRes.data.chartData[0] },
            { name: 'Mon', amount: weeklyRes.data.chartData[1] },
            { name: 'Tue', amount: weeklyRes.data.chartData[2] },
            { name: 'Wed', amount: weeklyRes.data.chartData[3] },
            { name: 'Thu', amount: weeklyRes.data.chartData[4] },
            { name: 'Fri', amount: weeklyRes.data.chartData[5] },
            { name: 'Sat', amount: weeklyRes.data.chartData[6] },
         ]
      });
      setMonthlyData({
         total: monthlyRes.data.totalCollection,
         completed: monthlyRes.data.completedRevenue,
         pending: monthlyRes.data.pendingPayments,
      });
      setPaymentHistory(historyRes.data);
      
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/admin/add-doctor", doctorForm);
      setNewCredentials(res.data.credentials);
      setDoctorForm({ fullName: "", email: "", specialization: "", location: "", experience: "", fee: "", image: "" });
      fetchDashboardData(); // Refresh list
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add doctor");
    }
  };

  const handleToggleDoctorStatus = async (id, currentStatus) => {
    try {
      await api.put(`/api/admin/update-doctor/${id}`, { available: !currentStatus });
      fetchDashboardData(); // Refresh list
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this doctor?")) return;
    try {
      await api.delete(`/api/admin/delete-doctor/${id}`);
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to delete doctor", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading generic interface...</p>
      </div>
    );
  }

  // Monthly Chart Prepping
  const monthlyChartData = [
    { name: 'Completed Payments', value: monthlyData.completed },
    { name: 'Pending Revenue', value: monthlyData.pending },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            Administrator Portal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Monitor system metrics, manage medical professionals, and review financial transactions.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 inline-flex h-12 flex-wrap items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground shadow-sm">
          {["overview", "doctors", "payments"].map((tab) => (
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
        {activeTab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Doctors Active"
                value={doctors.length}
                icon={Stethoscope}
                className="bg-primary/5 border-primary/20"
              />
              <StatCard
                title="Today's Total Payments"
                value={`₹${dailyPayments.toLocaleString()}`}
                icon={DollarSign}
              />
              <StatCard
                title="Weekly Aggregate"
                value={`₹${weeklyData.total.toLocaleString()}`}
                icon={Activity}
              />
              <StatCard
                title="Total System Appointments"
                value={paymentHistory.length}
                icon={Users}
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
               {/* Weekly Revenue Recharts */}
               <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                     <h3 className="font-semibold text-lg text-foreground">Weekly Revenue Trend</h3>
                     <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={weeklyData.chart}>
                         <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                         <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} width={60} />
                         <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`₹${value}`, 'Revenue']} />
                         <Line type="monotone" dataKey="amount" stroke="var(--color-primary, #2563eb)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                       </LineChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Monthly Progress Recharts */}
               <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                     <h3 className="font-semibold text-lg text-foreground">Monthly Collection</h3>
                     <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                         <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                         <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} width={60} />
                         <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`₹${value}`, 'Amount']} />
                         <Bar dataKey="value" fill="var(--color-primary, #3b82f6)" radius={[8, 8, 0, 0]} barSize={80} />
                       </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ================= DOCTORS TAB ================= */}
        {activeTab === "doctors" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             
            <div className="grid gap-8 lg:grid-cols-3">
               {/* Add Doctor Form */}
               <div className="lg:col-span-1 space-y-6">
                  <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                     <div className="mb-6 flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight">Onboard Doctor</h2>
                     </div>
                     
                     <form onSubmit={handleAddDoctor} className="space-y-4">
                        <div>
                           <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                           <Input required placeholder="Dr. John Doe" value={doctorForm.fullName} onChange={e => setDoctorForm({...doctorForm, fullName: e.target.value})} />
                        </div>
                        <div>
                           <label className="text-sm font-medium mb-1.5 block">Email Address <span className="text-xs text-muted-foreground">(Login ID)</span></label>
                           <Input required type="email" placeholder="doctor@clinic.com" value={doctorForm.email} onChange={e => setDoctorForm({...doctorForm, email: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-sm font-medium mb-1.5 block">Specialization</label>
                              <Input required placeholder="Cardiology" value={doctorForm.specialization} onChange={e => setDoctorForm({...doctorForm, specialization: e.target.value})} />
                           </div>
                           <div>
                              <label className="text-sm font-medium mb-1.5 block">Fee (₹)</label>
                              <Input required type="number" placeholder="500" value={doctorForm.fee} onChange={e => setDoctorForm({...doctorForm, fee: e.target.value})} />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-sm font-medium mb-1.5 block">Clinic Location</label>
                              <Input placeholder="City, State" value={doctorForm.location} onChange={e => setDoctorForm({...doctorForm, location: e.target.value})} />
                           </div>
                           <div>
                              <label className="text-sm font-medium mb-1.5 block">Years of Experience</label>
                              <Input type="number" placeholder="10" value={doctorForm.experience} onChange={e => setDoctorForm({...doctorForm, experience: e.target.value})} />
                           </div>
                        </div>
                        <div>
                           <label className="text-sm font-medium mb-1.5 block">Profile Image URL (Optional)</label>
                           <Input placeholder="https://example.com/image.jpg" value={doctorForm.image} onChange={e => setDoctorForm({...doctorForm, image: e.target.value})} />
                        </div>
                        <Button type="submit" className="w-full">Create Doctor Profile</Button>
                     </form>

                     {/* New Credentials Alert */}
                     {newCredentials && (
                        <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                           <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4"/> Profile Created!</h4>
                           <div className="text-sm text-green-800 space-y-1">
                              <p><strong>Email:</strong> {newCredentials.email}</p>
                              <p><strong>Password:</strong> {newCredentials.password}</p>
                              <p className="text-xs mt-2 opacity-80">Please provide these credentials to the doctor. The password will not be shown again.</p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Doctor Management Table */}
               <div className="lg:col-span-2">
                  <div className="rounded-3xl border border-border/50 bg-card overflow-hidden shadow-sm">
                     <div className="p-6 border-b border-border/50">
                        <h2 className="text-xl font-bold tracking-tight">Active Professionals Directory</h2>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                              <tr>
                                 <th className="px-6 py-4">Doctor Details</th>
                                 <th className="px-6 py-4">Spec & Fee</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-border/50">
                              {doctors.length > 0 ? (
                                 doctors.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                                       <td className="px-6 py-4 flex items-center gap-3">
                                          <img src={doc.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"} className="h-10 w-10 rounded-full object-cover bg-muted" alt="Doctor" />
                                          <div>
                                             <div className="font-medium text-foreground">{doc.fullName}</div>
                                             <div className="text-muted-foreground text-xs">{doc.email}</div>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4">
                                          <div>{doc.specialization}</div>
                                          <div className="text-muted-foreground text-xs font-semibold">₹{doc.fee} • {doc.experience || 0} Yrs</div>
                                       </td>
                                       <td className="px-6 py-4">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                             ${doc.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                             {doc.available ? "Active" : "Inactive"}
                                          </span>
                                       </td>
                                       <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                          <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => handleToggleDoctorStatus(doc.id, doc.available)}>
                                             {doc.available ? "Disable" : "Enable"}
                                          </Button>
                                          <Button size="sm" variant="ghost" className="h-8 rounded-lg outline-destructive text-destructive" onClick={() => handleDeleteDoctor(doc.id)}>
                                             <Trash2 className="h-4 w-4" />
                                          </Button>
                                       </td>
                                    </tr>
                                 ))
                              ) : (
                                 <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">
                                       No doctors registered in the system yet.
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ================= PAYMENTS TAB ================= */}
        {activeTab === "payments" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Payment History Table */}
            <div className="rounded-3xl border border-border/50 bg-card overflow-hidden shadow-sm">
               <div className="p-6 border-b border-border/50 flex justify-between items-center">
                  <h2 className="text-xl font-bold tracking-tight">Complete Transaction Log</h2>
                  <span className="text-sm text-muted-foreground">Sorted by newest</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                     <tr>
                       <th className="px-6 py-4">Transaction ID / Date</th>
                       <th className="px-6 py-4">Patient & Doctor</th>
                       <th className="px-6 py-4">Method & Amount</th>
                       <th className="px-6 py-4">System Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border/50">
                     {paymentHistory.length > 0 ? (
                        paymentHistory.map((pt) => (
                           <tr key={pt.id} className="hover:bg-muted/20 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="font-mono text-xs text-muted-foreground mb-1">{pt.id}</div>
                                 <div className="font-medium">{pt.date} at {pt.time}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="font-medium">Patient: {pt.patientName}</div>
                                 <div className="text-muted-foreground text-xs">Visits: {pt.doctorName}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="font-bold text-foreground">₹{pt.amount}</div>
                                 <div className="text-muted-foreground text-xs tracking-wider uppercase">{pt.method}</div>
                              </td>
                              <td className="px-6 py-4 space-y-1">
                                 <div>Payment: 
                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-wider
                                       ${pt.status === 'paid' ? 'text-green-600 bg-green-500/10' : 'text-yellow-600 bg-yellow-500/10'}`}>
                                       {pt.status}
                                    </span>
                                 </div>
                                 <div className="text-xs text-muted-foreground">Appt State: {pt.appointmentStatus}</div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">
                              No payment transactions found.
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

export default AdminDashboard;
