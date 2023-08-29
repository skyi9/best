const nodeMailer = require("nodemailer");
exports.sendEmail = async (options) => {

    const transport = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a99b6075c7476e",
            pass: "455e83738837fe"
        }
    });

    const mailOptions = {
        from: "mymail@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transport.sendMail(mailOptions);
}