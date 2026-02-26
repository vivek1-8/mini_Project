import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

import {
  Star,
  MapPin,
  Clock,
  GraduationCap,
} from "lucide-react";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "04:00 PM",
  ];

  /* ================= FETCH DOCTOR ================= */
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Doctor fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  /* ================= FULL RAZORPAY FLOW ================= */
  const handleRazorpayPayment = async () => {
    try {
      if (!selectedDate || !selectedTime) {
        alert("Please select date and time");
        return;
      }

      setBookingLoading(true);

      // 1️⃣ Create order from backend
      const { data: order } = await api.post(
        "/api/payment/create-order",
        {
          amount: doctor.fee,
        }
      );

      // 2️⃣ Configure Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_CbnfJtVumEy6z5",
        amount: order.amount,
        currency: "INR",
        name: "MediCare",
        description: "Doctor Appointment Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            // 3️⃣ Verify payment & create appointment
            await api.post("/api/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              doctorId: doctor._id,
              date: selectedDate,
              time: selectedTime,
              amount: doctor.fee,
            });

            alert("✅ Payment Successful & Appointment Booked!");
            navigate("/patient-dashboard");

          } catch (error) {
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: "Patient",
          email: "patient@email.com",
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", function (response) {
        alert("Payment Failed: " + response.error.description);
      });

      razor.open();

    } catch (error) {
      console.error(error);
      alert("Payment initialization failed");
    } finally {
      setBookingLoading(false);
    }
  };

  /* ================= UI ================= */

  if (loading) return <div className="p-10">Loading...</div>;
  if (!doctor) return <div className="p-10">Doctor not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* DOCTOR INFO */}
          <div className="lg:col-span-2 bg-card p-6 rounded-2xl shadow-card">

            <div className="flex gap-6">

              <img
                src={doctor.image || "/placeholder.jpg"}
                alt={doctor.name}
                className="w-32 h-32 rounded-xl object-cover"
              />

              <div>
                <h1 className="text-2xl font-bold">
                  {doctor.name || doctor.fullName || "Doctor"}
                </h1>

                <p className="text-primary font-medium">
                  {doctor.specialty}
                </p>

                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  {doctor.rating || 4.5}
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {doctor.location}
                  </div>

                  <div className="flex gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {doctor.experience} years experience
                  </div>

                  <div className="flex gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    {doctor.education}
                  </div>
                </div>

                <div className="mt-4 text-lg font-bold text-primary">
                  Consultation Fee: ₹{doctor.fee}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold mb-2">
                About Doctor
              </h2>
              <p className="text-muted-foreground">
                {doctor.about}
              </p>
            </div>
          </div>

          {/* BOOKING SECTION */}
          <div className="bg-card p-6 rounded-2xl shadow-card sticky top-24">

            <h2 className="text-xl font-semibold mb-4">
              Book Appointment
            </h2>

            {/* DATE PICKER */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Select Date
              </label>

              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                minDate={new Date()}
                className="border px-4 py-2 rounded-lg w-full"
                placeholderText="Choose appointment date"
              />
            </div>

            {/* TIME SLOTS */}
            {selectedDate && (
              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  Select Time
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg ${
                        selectedTime === time
                          ? "bg-primary text-white"
                          : "bg-muted"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full"
              disabled={!selectedDate || !selectedTime || bookingLoading}
              onClick={handleRazorpayPayment}
            >
              {bookingLoading
                ? "Processing..."
                : `Pay ₹${doctor.fee}`}
            </Button>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default DoctorDetails;