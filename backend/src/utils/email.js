const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `Doctor Appointment Management System <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Generic Email sent to: ${options.email}`);
  } catch (error) {
    console.error("Generic Email sending failed:", error);
  }
};

const sendAppointmentConfirmationEmail = async (patientEmail, appointmentDetails) => {
  try {
    const {
      patientName,
      doctorName,
      specialization,
      appointmentDate,
      appointmentTime,
      appointmentId,
      location,
      paymentAmount
    } = appointmentDetails;

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f7f6; }
          .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background-color: #2563eb; color: #ffffff; padding: 30px 40px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
          .content { padding: 40px; }
          .greeting { font-size: 18px; margin-bottom: 20px; color: #1e293b; }
          .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin: 25px 0; }
          .card-title { font-size: 14px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
          .detail-label { color: #64748b; font-weight: 500; }
          .detail-value { color: #0f172a; font-weight: 600; text-align: right; }
          .highlight { display: inline-block; background-color: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 99px; font-size: 13px; font-weight: 700; }
          .footer { background-color: #f8fafc; padding: 25px 40px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Healthcare Excellence Center</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${patientName},</div>
            <p>Your appointment has been <strong>successfully confirmed</strong>. We are looking forward to providing you with excellent care.</p>
            
            <div class="card">
              <div class="card-title">Appointment Details</div>
              
              <div class="detail-row">
                <span class="detail-label">Doctor:</span>
                <span class="detail-value">Dr. ${doctorName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Specialization:</span>
                <span class="detail-value">${specialization}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${appointmentDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${location || 'Main Clinic Location'}</span>
              </div>
            </div>

            <div class="card">
              <div class="card-title">Transaction Information</div>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value" style="font-family: monospace; font-size: 13px;">${appointmentId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Amount:</span>
                <span class="detail-value">₹${paymentAmount}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status:</span>
                <span class="detail-value"><span class="highlight">PAID \u2713</span></span>
              </div>
            </div>

            <p style="text-align: center; font-size: 14px; margin-top: 30px; color: #475569;">
              <strong>Please arrive 10 minutes before your appointment time.</strong><br/>
              If you need to reschedule, please log in to your patient dashboard or contact us at least 24 hours in advance.
            </p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing our healthcare services.</p>
            <p>&copy; ${new Date().getFullYear()} Healthcare Excellence Center. All rights reserved.</p>
            <p>Need help? Contact support at +91 1800-123-4567 or reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Appointment Confirmations" <${process.env.SMTP_USER}>`,
      to: patientEmail,
      subject: "Appointment Confirmation \u2013 Your Booking is Confirmed",
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`\u2705 Appointment Confirmation Email successfully sent to: ${patientEmail}`);
    return info;
  } catch (error) {
    console.error("\u274c Failed to send Appointment Confirmation Email:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendAppointmentConfirmationEmail
};
