import { Link } from "react-router-dom";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DoctorCard = ({ doctor, featured = false }) => {
  if (!doctor) return null;

  const data = doctor;

  return (
    <div
      className={cn(
        "group bg-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2",
        featured
          ? "shadow-card-hover"
          : "shadow-card hover:shadow-card-hover"
      )}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={data?.image || "/placeholder.jpg"}
          alt={data?.name || data?.fullName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-4 right-4">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              data?.available
                ? "bg-success/90 text-success-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {data?.available ? "Available" : "Unavailable"}
          </span>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-primary/90 text-primary-foreground rounded-full text-sm">
            {data?.specialty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* 🔥 FIXED NAME */}
        <h3 className="text-xl font-semibold mb-2">
          {data?.name || data?.fullName || "Doctor Name"}
        </h3>

        <div className="flex items-center gap-2 text-sm mb-4">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span>{data?.rating || 0}</span>
          <span>({data?.reviews || 0} reviews)</span>
        </div>

        <div className="flex items-center gap-2 text-sm mb-2">
          <MapPin className="h-4 w-4" />
          {data?.location || "Location"}
        </div>

        <div className="flex items-center gap-2 text-sm mb-6">
          <Clock className="h-4 w-4" />
          {data?.experience || 0} years experience
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <div>
            <span className="text-2xl font-bold">
              ${data?.fee || 0}
            </span>
            <span className="text-sm"> / visit</span>
          </div>

          <Button asChild size="sm">
            <Link
              to={`/doctor/${data?._id}`}
              className="flex gap-2"
            >
              Book Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
