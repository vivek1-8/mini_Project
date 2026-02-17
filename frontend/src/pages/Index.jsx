import { useEffect, useState } from "react";
import axios from "axios";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { FeaturedDoctors } from "@/components/home/FeaturedDoctors";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- AXIOS FETCH -------------------- */
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        const doctors = res.data.slice(0, 4).map((u) => ({
          id: u.id,
          name: u.name,
          specialty: "General Physician",
          location: u.address.city,
          rating: 4.8,
          reviews: 100,
          image: `https://i.pravatar.cc/300?img=${u.id}`,
          fee: 40,
        }));

        setFeaturedDoctors(doctors);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <HeroSection />
        <FeaturesSection />

        {/* 🔥 Featured Doctors with Axios Data */}
        <FeaturedDoctors
          doctors={featuredDoctors}
          loading={loading}
        />

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
