import nodemailer from 'nodemailer'; 
import dotenv from 'dotenv';

dotenv.config();
const gmail = process.env.EMAIL;
const passwo = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmail,
        pass: passwo,
    },
});

const gmailTransfer = (toGmail, name, textData) => {
    const mailOptions = {
        from: gmail,
        to: toGmail,
        subject: `Hi ${name}, Here is your report from MyDoctorAlly`,
        text: textData,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
};


export default gmailTransfer;
