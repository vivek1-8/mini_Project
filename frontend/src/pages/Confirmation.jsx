import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Download,
  Home,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ TS casting removed
  const { doctor, date, time, patient } = location.state || {};

  const [loading, setLoading] = useState(false);

  /* -------------------- SAFETY CHECK -------------------- */
  if (!doctor || !date || !time || !patient) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">
            No confirmation details found
          </h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  /* -------------------- DATE FORMAT -------------------- */
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const confirmationNumber = `MC${Date.now().toString().slice(-8)}`;

  /* -------------------- AXIOS FETCH (EXAMPLE) -------------------- */
  useEffect(() => {
    setLoading(true);

    // 🔥 Example: send confirmation data to server
    axios
      .post("https://jsonplaceholder.typicode.com/posts", {
        confirmationNumber,
        doctor,
        date,
        time,
        patient,
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* SUCCESS */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Appointment Confirmed!
            </h1>
            <p className="text-muted-foreground">
              {loading
                ? "Saving confirmation..."
                : "Your appointment has been successfully booked"}
            </p>
          </div>

          {/* CARD */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            {/* HEADER */}
            <div className="gradient-primary p-6 text-center">
              <p className="text-sm opacity-80">Confirmation Number</p>
              <p className="text-2xl font-bold tracking-wider">
                {confirmationNumber}
              </p>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-8">
              {/* DOCTOR */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-primary">{doctor.specialty}</p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.location}
                  </p>
                </div>
              </div>

              {/* APPOINTMENT */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex gap-3 p-4 bg-muted rounded-xl">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-muted rounded-xl">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{time}</p>
                  </div>
                </div>
              </div>

              {/* PATIENT */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  {patient.firstName} {patient.lastName}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {patient.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {patient.phone}
                </div>
              </div>

              {/* FEE */}
              <div className="flex justify-between p-4 bg-primary/5 rounded-xl">
                <span>Consultation Fee</span>
                <span className="text-xl font-bold text-primary">
                  ${doctor.fee}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download Receipt
                </Button>

                <Button asChild className="flex-1 gap-2">
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Confirmation;
