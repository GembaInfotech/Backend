import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "prashantrana9516@gmail.com",
      pass: "qqjsatrjwvbynknut",
    },
  });

function sendVerificationEmail(data, emailTemplate) {
    console.log("dfhbhjfbghj.....");
    console.log(data);
    const mailOptions = {
      from: "prashantrana9516@gmail.com",
      to: data.mail,
      subject: "Parkar-Verify Your Email",
      html: emailTemplate,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
}

export default sendVerificationEmail;
