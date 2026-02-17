import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/* -------------------- ZOD SCHEMA (JS OK) -------------------- */
const bookingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  reason: z.string().min(10, "Please describe your reason for the visit"),
});

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ TS casting removed
  const { doctor, date, time } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  /* -------------------- NO DATA SAFETY -------------------- */
  if (!doctor || !date || !time) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">
            No appointment details found
          </h1>
          <Button onClick={() => navigate("/doctors")}>
            Find a Doctor
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  /* -------------------- AXIOS SUBMIT -------------------- */
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // 🔥 Axios API call (mock / real)
      await axios.post("https://jsonplaceholder.typicode.com/posts", {
        doctor,
        date,
        time,
        patient: data,
      });

      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully scheduled.",
      });

      navigate("/confirmation", {
        state: {
          doctor,
          date,
          time,
          patient: data,
        },
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* ---------------- FORM ---------------- */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-2">
                  Complete Your Booking
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label>First Name</label>
                      <input
                        {...register("firstName")}
                        className="input"
                      />
                      {errors.firstName && (
                        <p className="text-destructive">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label>Last Name</label>
                      <input
                        {...register("lastName")}
                        className="input"
                      />
                      {errors.lastName && (
                        <p className="text-destructive">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label>Email</label>
                    <input {...register("email")} className="input" />
                    {errors.email && (
                      <p className="text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label>Phone</label>
                    <input {...register("phone")} className="input" />
                    {errors.phone && (
                      <p className="text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label>Reason</label>
                    <textarea
                      {...register("reason")}
                      rows={4}
                      className="input"
                    />
                    {errors.reason && (
                      <p className="text-destructive">
                        {errors.reason.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Booking..." : "Confirm Appointment"}
                  </Button>
                </form>
              </div>
            </div>

            {/* ---------------- SUMMARY ---------------- */}
            <div>
              <div className="bg-card rounded-2xl p-6 sticky top-24">
                <h2 className="font-semibold mb-4">Appointment Summary</h2>

                <div className="flex gap-4 mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-xl"
                  />
                  <div>
                    <p className="font-semibold">{doctor.name}</p>
                    <p className="text-primary">{doctor.specialty}</p>
                  </div>
                </div>

                <p>📅 {formattedDate}</p>
                <p>⏰ {time}</p>
                <p>📍 {doctor.location}</p>

                <div className="mt-4 font-bold text-primary">
                  Fee: ${doctor.fee}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookAppointment;
