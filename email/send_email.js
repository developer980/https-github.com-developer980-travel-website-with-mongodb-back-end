module.exports = function send_email(db, email, transport) {
    return new Promise((resolve, reject) => {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

        let token = ''

        for (let i = 0; i < 25; i++){
            token += characters[Math.floor(Math.random() * characters.length)]
        }

        db.collection("users").updateOne({ "email": email }, {
            $set: {
                "pass_token":token
            }
        })

        const mailOptions = {
            from: process.env.EML,
            to: email,
            subject: "Password reset",
            html: `<div>
                <b>Reset your password by accesing this </b>
                <a href = "https://travel-website-with-mongodb-front-end-bszn.vercel.app/resetPasswordfor_${token}">Link</a>
            </div>`
        }
        transport.sendMail(mailOptions, err => {
            err ? console.log(err) : console.log("Email sent")
        })  
        resolve("Email sent")
    })
    
}