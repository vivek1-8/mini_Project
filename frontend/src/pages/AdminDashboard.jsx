import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalCollection, setTotalCollection] = useState(0);

  const [doctorData, setDoctorData] = useState({
    fullName: "",
    specialization: "",
    location: "",
    experience: "",
    fee: "",
    image: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchDailyAppointments();
    fetchDailyPayments();
  }, []);

  const fetchDailyAppointments = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/daily-appointments"
    );
    setAppointments(res.data);
  };

  const fetchDailyPayments = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/daily-payments"
    );
    setTotalCollection(res.data.totalCollection);
  };

/* ================= ADD DOCTOR ================= */
const handleAddDoctor = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/admin/add-doctor",
      doctorData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Doctor Added Successfully");

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Unauthorized");
  }
};

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* ================= ADD DOCTOR ================= */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>

        <form onSubmit={handleAddDoctor} className="grid gap-4">
          <input
            placeholder="Full Name"
            onChange={(e) =>
              setDoctorData({ ...doctorData, fullName: e.target.value })
            }
          />
          <input
            placeholder="Specialization"
            onChange={(e) =>
              setDoctorData({
                ...doctorData,
                specialization: e.target.value,
              })
            }
          />
          <input
            placeholder="Location"
            onChange={(e) =>
              setDoctorData({ ...doctorData, location: e.target.value })
            }
          />
          <input
            placeholder="Experience"
            onChange={(e) =>
              setDoctorData({
                ...doctorData,
                experience: e.target.value,
              })
            }
          />
          <input
            placeholder="Fee"
            onChange={(e) =>
              setDoctorData({ ...doctorData, fee: e.target.value })
            }
          />
          <input
            placeholder="Image URL"
            onChange={(e) =>
              setDoctorData({ ...doctorData, image: e.target.value })
            }
          />

          <Button type="submit">Add Doctor</Button>
        </form>
      </div>

      {/* ================= DAILY APPOINTMENTS ================= */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Today's Appointments
        </h2>

        {appointments.map((a) => (
          <div key={a._id} className="border p-4 mb-2">
            {a.doctor?.fullName} — ₹{a.paymentAmount}
          </div>
        ))}
      </div>

      {/* ================= DAILY PAYMENT ================= */}
      <div>
        <h2 className="text-xl font-semibold">
          Today's Collection: ₹{totalCollection}
        </h2>
      </div>
    </div>
  );
};

export default AdminDashboard;
