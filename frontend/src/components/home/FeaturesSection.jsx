import { CalendarCheck, Shield, Clock, Users, Heart, Award } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export function FeaturesSection() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get("/api/features");
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setFeatures(response.data);
        } else {
          console.warn("API returned non-array, using fallback features");
          setFeatures(defaultFeatures);
        }
      } catch (error) {
        console.error("Error fetching features:", error);
        setFeatures(defaultFeatures);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const defaultFeatures = [
    {
      icon: CalendarCheck,
      title: "Easy Scheduling",
      description: "Book appointments online in seconds with our intuitive booking system.",
    },
    {
      icon: Shield,
      title: "Verified Doctors",
      description: "All our doctors are verified professionals with proven expertise.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you anytime.",
    },
    {
      icon: Users,
      title: "Expert Care",
      description: "Access to top specialists across various medical fields.",
    },
    {
      icon: Heart,
      title: "Patient First",
      description: "Your health and comfort are our top priorities.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "High-quality healthcare services meeting international standards.",
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <section className="py-20 bg-medical-soft">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose MediCare?
          </h2>
          <p className="text-muted-foreground text-lg">
            We provide comprehensive healthcare solutions designed around your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(features) &&
            features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
