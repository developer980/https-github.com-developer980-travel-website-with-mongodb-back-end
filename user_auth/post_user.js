const bcrypt = require("bcryptjs")

module.exports = function post_user(db, email, username, password, token, transport) {
    return new Promise((resolve, reject) => {
        const salt = bcrypt.genSaltSync(process.env.SLENGTH)

        const hashedPassword = bcrypt.hashSync(password, salt)

        console.log("Endpoint available")

        const user_data = db.collection("users").find({
            email:email
        })
        
        const response = []

        user_data.forEach((result, err) => {
            console.log(result)
            response.push(result)
        }, () => {
            if (response[0])
                reject("Email is invalid") 
            else {
                db.collection("pending_users").insertOne({
                    username,
                    email,
                    password: hashedPassword,
                    token,
                })
                const mailOptions = {
                    from: process.env.EML,
                    to: email,
                    subject: "Email confirmation",
                    html: `<div>
                        <b>Please verify your email</b>
                        <a href = "https://travel-website-with-mongodb-front-end-bszn.vercel.app/confirm_${token}">Link</a>
                    </div>`
                }
                transport.sendMail(mailOptions, (err, res) => {
                    err ? console.log(err) : console.log("Email sent")
                })
                resolve("Email sent")
            }
        })
    })
    
}