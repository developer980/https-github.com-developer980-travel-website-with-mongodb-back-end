module.exports = function send_email(db, email, transport, subject, text, link) {
    return new Promise((resolve, reject) => {

        const mailOptions = {
            from: process.env.EML,
            to: email,
            subject: subject,
            html: `<div>
                <b>${text}</b>
                <a href = "${link}">Link</a>
            </div>`
        }
        transport.sendMail(mailOptions, err => {
            err ? console.log(err) : console.log("Email sent")
        })  
        resolve("Email sent")
    })
    
}