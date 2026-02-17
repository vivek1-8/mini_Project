import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { useState } from "react";

export function CTASection
      () {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCallUs = async () => {
    setLoading(true);
    setError(null);
    try {const response = await axios.get("/api/contact"); // Replace with your endpoint
      console.log("Contact data:", response.data);
      // Handle success (e.g., show phone number or redirect)
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-40 h-40 border-2 border-white rounded-full" />
        <div className="absolute bottom-10 right-20 w-60 h-60 border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Book an appointment today and get the care you deserve from our expert medical professionals.
          </p>

          {error && <p className="text-red-300 mb-4">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" variant="accent" className="gap-2">
              <Link to="/doctors">
                Book Appointment
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="xl"
              className="gap-2 bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/20"
              onClick={handleCallUs}
              disabled={loading}
            >
              <Phone className="h-5 w-5" />
              {loading ? "Loading..." : "Call Us Now"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
