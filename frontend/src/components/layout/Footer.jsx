import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import axios from "axios";

export function Footer() {
  const [footerData, setFooterData] = useState({
    quickLinks: [],
    specialties: [],
  });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get("/api/footer");
        // Ensure the fetched data contains arrays
        const data = {
          quickLinks: Array.isArray(response.data?.quickLinks) ? response.data.quickLinks : [],
          specialties: Array.isArray(response.data?.specialties) ? response.data.specialties : [],
        };
        setFooterData(data);
      } catch (error) {
        console.error("Error fetching footer data:", error);
        // Fallback to default
        setFooterData({
          quickLinks: ["Find Doctors", "Book Appointment", "Health Blog", "Our Services"],
          specialties: ["Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology"],
        });
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Medi<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Your trusted partner in healthcare. We connect you with the best doctors
              for quality medical care.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2 rounded-lg bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {Array.isArray(footerData.quickLinks) &&
                footerData.quickLinks.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-background/70 hover:text-primary transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="font-semibold mb-4">Specialties</h4>
            <ul className="space-y-3">
              {Array.isArray(footerData.specialties) &&
                footerData.specialties.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-background/70 hover:text-primary transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-background/70 text-sm">
                  123 Medical Center Dr,<br />New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-background/70 text-sm">1-800-MEDICARE</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-background/70 text-sm">contact@medicare.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm">© 2024 MediCare. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-background/50 hover:text-background text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-background/50 hover:text-background text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
