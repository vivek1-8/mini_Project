require("dotenv").config();
const { sendAppointmentConfirmationEmail } = require("./src/utils/email");

const test = async () => {
    try {
        await sendAppointmentConfirmationEmail("luckysingh49946@gmail.com", {
            patientName: "Test Patient",
            doctorName: "Test Doctor",
            specialization: "Cardiology",
            appointmentDate: new Date().toDateString(),
            appointmentTime: "10:00 AM",
            appointmentId: "12345",
            location: "Test Clinic",
            paymentAmount: 500
        });
        console.log("Success");
    } catch(err) {
        console.error("Error:", err);
    }
}
test();
