import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export function HeroSection() {
  const [stats, setStats] = useState([
    { value: "200+", label: "Expert Doctors" },
    { value: "50K+", label: "Happy Patients" },
    { value: "15+", label: "Specialties" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/stats");
        // Ensure response.data is always an array
        setStats(Array.isArray(response.data) ? response.data : stats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              Trusted by 50,000+ patients
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Find the Best{" "}
              <span className="text-primary relative">
                Doctors
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              Near You
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Book appointments with top-rated healthcare professionals. 
              Get quality care from the comfort of your home or visit in person.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="xl" variant="hero">
                <Link to="/doctors" className="gap-2">
                  <Search className="h-5 w-5" />
                  Find a Doctor
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/doctors" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              {Array.isArray(stats) && stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:pl-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=700&fit=crop"
                alt="Doctor consulting patient"
                className="relative rounded-3xl shadow-card-hover w-full object-cover"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-card animate-float">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-success/10 rounded-xl">
                    <Calendar className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Easy Booking</p>
                    <p className="text-sm text-muted-foreground">Book in 2 minutes</p>
                  </div>
                </div>
              </div>

              {/* Rating Card */}
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-2xl shadow-card animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-semibold">4.9</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">From 10k+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
