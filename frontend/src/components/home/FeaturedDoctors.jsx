import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorCard from "@/components/doctors/DoctorCard";
import axios from "axios";

export function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/doctors"
        );

        const doctorsArray = Array.isArray(response.data)
          ? response.data
          : response.data?.doctors || [];

        setDoctors(doctorsArray.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError(err.message);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Meet Our Expert Doctors
            </h2>
            <p className="text-muted-foreground text-lg">
              Highly qualified professionals ready to serve you
            </p>
          </div>

          <Button asChild variant="outline" className="gap-2">
            <Link to="/doctors">
              View All Doctors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <div
              key={doctor._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DoctorCard doctor={doctor} featured />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
