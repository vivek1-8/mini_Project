import React, { useEffect, useState } from "react";
import axios from "axios";

/* -------------------- DOCTOR DATA -------------------- */
const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    experience: 15,
    rating: 4.9,
    reviews: 328,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    available: true,
    location: "New York Medical Center",
    fee: 150,
    education: "MD, Harvard Medical School",
    about:
      "Dr. Sarah Mitchell is a board-certified cardiologist with over 15 years of experience.",
    languages: ["English", "Spanish"],
    availableSlots: [
      { date: "2024-01-15", slots: ["09:00 AM", "10:00 AM", "02:00 PM"] },
    ],
  },
  {
    id: 2,
    name: "Dr. James Chen",
    specialty: "Dermatologist",
    experience: 12,
    rating: 4.8,
    reviews: 256,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    available: true,
    location: "Manhattan Skin Clinic",
    fee: 120,
    education: "MD, Johns Hopkins University",
    about:
      "Dr. James Chen is an expert dermatologist in cosmetic and medical dermatology.",
    languages: ["English", "Mandarin"],
    availableSlots: [
      { date: "2024-01-16", slots: ["09:00 AM", "11:30 AM", "02:00 PM"] },
    ],
  },
];

/* -------------------- AXIOS MOCK FETCH -------------------- */
/*
  Backend allowed nahi hai,
  isliye Axios ko mock API jaise use kar rahe hain
*/
const fetchDoctors = async () => {
  // Fake API response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: doctorsData });
    }, 800);
  });
};

/* -------------------- COMPONENT -------------------- */
const DoctorApp = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors()
      .then((res) => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading doctors...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Doctor Appointment App</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h3>{doctor.name}</h3>
            <p><b>{doctor.specialty}</b></p>
            <p>⭐ {doctor.rating} ({doctor.reviews} reviews)</p>
            <p>💼 {doctor.experience} yrs experience</p>
            <p>💰 Fee: ${doctor.fee}</p>
            <p>📍 {doctor.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorApp;
