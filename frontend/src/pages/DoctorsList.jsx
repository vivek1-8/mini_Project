import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DoctorsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] =
    useState("All Specialties");
  const [showFilters, setShowFilters] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- AXIOS FETCH -------------------- */
  useEffect(() => {
    setLoading(true);

    // 🔥 Demo API (replace with real backend later)
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        const mappedDoctors = res.data.map((u) => ({
          id: u.id,
          name: u.name,
          specialty: "General Physician",
          location: u.address.city,
          rating: 4.6,
          reviews: 120,
          experience: 7,
          fee: 40,
          image: `https://i.pravatar.cc/300?img=${u.id}`,
          available: true,
        }));

        setDoctors(mappedDoctors);

        // 🔹 Generate specialties dynamically
        setSpecialties([
          "All Specialties",
          ...new Set(mappedDoctors.map((d) => d.specialty)),
        ]);

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* -------------------- FILTER LOGIC -------------------- */
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        doctor.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading doctors...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* HEADER */}
        <section className="py-12 bg-medical-soft">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Doctor
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Browse qualified healthcare professionals and book appointments.
            </p>

            {/* SEARCH */}
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-card border rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                variant="outline"
                size="lg"
                className="gap-2 md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </Button>
            </div>
          </div>
        </section>

        {/* FILTERS & RESULTS */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* SIDEBAR */}
              <aside
                className={cn(
                  "lg:w-64",
                  showFilters ? "block" : "hidden lg:block"
                )}
              >
                <div className="bg-card p-6 rounded-2xl shadow-card sticky top-24">
                  <div className="flex gap-2 mb-6">
                    <Filter className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Filters</h3>
                  </div>

                  <h4 className="text-sm font-medium mb-3">
                    Specialty
                  </h4>
                  <div className="space-y-2">
                    {specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg text-sm text-left",
                          selectedSpecialty === specialty
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-primary/10"
                        )}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* RESULTS */}
              <div className="flex-1">
                <p className="mb-6 text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredDoctors.length}
                  </span>{" "}
                  doctors
                </p>

                {filteredDoctors.length > 0 ? (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor, index) => (
                      <div
                        key={doctor.id}
                        style={{
                          animationDelay: `${index * 0.05}s`,
                        }}
                        className="animate-slide-up"
                      >
                        <DoctorCard doctor={doctor} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-card rounded-2xl">
                    <h3 className="text-xl font-semibold mb-2">
                      No doctors found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorsList;
