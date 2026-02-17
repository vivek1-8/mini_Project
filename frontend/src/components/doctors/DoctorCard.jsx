import { Link } from "react-router-dom";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";

export function DoctorCard({ doctor, featured = false }) {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`/api/doctors/${doctor.id}`);
        setDoctorData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctor.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const data = doctorData || doctor;

  return (
    <div
      className={cn(
        "group bg-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2",
        featured ? "shadow-card-hover" : "shadow-card hover:shadow-card-hover"
      )}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-4 right-4">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              data.available
                ? "bg-success/90 text-success-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {data.available ? "Available" : "Unavailable"}
          </span>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-primary/90 text-primary-foreground rounded-full text-sm">
            {data.specialty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{data.name}</h3>

        <div className="flex items-center gap-2 text-sm mb-4">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span>{data.rating}</span>
          <span>({data.reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2 text-sm mb-2">
          <MapPin className="h-4 w-4" />
          {data.location}
        </div>

        <div className="flex items-center gap-2 text-sm mb-6">
          <Clock className="h-4 w-4" />
          {data.experience} years experience
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <div>
            <span className="text-2xl font-bold">${data.fee}</span>
            <span className="text-sm"> / visit</span>
          </div>

          <Button asChild size="sm">
            <Link to={`/doctor/${data.id}`} className="flex gap-2">
              Book Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
