import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Star,
  MapPin,
  Clock,
  GraduationCap,
  Languages,
  Calendar,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  /* -------------------- AXIOS FETCH -------------------- */
  useEffect(() => {
    setLoading(true);

    // 🔥 Replace with your real API later
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        // 🧪 Mock mapping (API → Doctor shape)
        const mappedDoctors = res.data.map((u) => ({
          id: u.id,
          name: u.name,
          specialty: "General Physician",
          rating: 4.5,
          reviews: 120,
          experience: 8,
          education: "MBBS, MD",
          languages: ["English", "Hindi"],
          location: u.address.city,
          fee: 50,
          available: true,
          image: `https://i.pravatar.cc/300?img=${u.id}`,
          about:
            "Experienced doctor providing quality healthcare with patient-first approach.",
          availableSlots: [
            {
              date: "2025-12-15",
              slots: ["10:00 AM", "11:30 AM", "01:00 PM"],
            },
            {
              date: "2025-12-16",
              slots: ["09:30 AM", "12:00 PM", "03:00 PM"],
            },
          ],
        }));

        const foundDoctor = mappedDoctors.find(
          (d) => d.id === Number(id)
        );

        setDoctor(foundDoctor);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading doctor details...
      </div>
    );
  }

  /* -------------------- NOT FOUND -------------------- */
  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Doctor not found</h1>
          <Button onClick={() => navigate("/doctors")}>
            Back to Doctors
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  /* -------------------- BOOKING -------------------- */
  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      navigate("/book-appointment", {
        state: {
          doctor,
          date: selectedDate,
          time: selectedTime,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* BACK */}
          <Button
            variant="ghost"
            onClick={() => navigate("/doctors")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Doctors
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* INFO */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {doctor.specialty}
                      </span>
                      {doctor.available && (
                        <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Available
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl font-bold mb-2">
                      {doctor.name}
                    </h1>

                    <div className="flex items-center gap-2 text-sm mb-4">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span>{doctor.rating}</span>
                      <span>({doctor.reviews} reviews)</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {doctor.location}
                      </div>
                      <div className="flex gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {doctor.experience} yrs experience
                      </div>
                      <div className="flex gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        {doctor.education}
                      </div>
                      <div className="flex gap-2">
                        <Languages className="h-4 w-4 text-primary" />
                        {doctor.languages.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ABOUT */}
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-semibold mb-3">
                  About Doctor
                </h2>
                <p className="text-muted-foreground">{doctor.about}</p>
              </div>
            </div>

            {/* BOOKING */}
            <div>
              <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
                <div className="flex justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Book Appointment
                  </h2>
                  <span className="text-2xl font-bold text-primary">
                    ${doctor.fee}
                  </span>
                </div>

                {/* DATE */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2 flex gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Select Date
                  </h3>
                  {doctor.availableSlots.map((slot) => (
                    <button
                      key={slot.date}
                      onClick={() => {
                        setSelectedDate(slot.date);
                        setSelectedTime(null);
                      }}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl text-left mb-2",
                        selectedDate === slot.date
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {new Date(slot.date).toDateString()}
                    </button>
                  ))}
                </div>

                {/* TIME */}
                {selectedDate && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">
                      Select Time
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {doctor.availableSlots
                        .find((s) => s.date === selectedDate)
                        ?.slots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "px-3 py-2 rounded-lg",
                              selectedTime === time
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleBookAppointment}
                >
                  Continue to Booking
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

export default DoctorDetails;
