const sgMail = require("@sendgrid/mail");
const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "paarth.soin9@gmail.com",
        subject: "Thanks for joining in!!!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:"paarth.soin9@gmail.com",
        subject: "Pls dont go....",
        text: `Good by ${name}, We will miss you !!!`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}