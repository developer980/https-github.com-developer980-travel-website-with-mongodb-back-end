const bcrypt = require('bcryptjs')
const generate_token = require("./generate_token")
const send_email = require("../email/send_email")

module.exports = function Search_User(email, transport, password, db) {
    return new Promise((resolve, reject) => {
        const result = []
        try {
            
            db.collection('users').findOne({
                email: email
            }, (err, user) => {
                if (err) throw err
                
                if (user && password) {
                    bcrypt.compare(password, user.password, (err, succes) => {
                        console.log("password matches")
                                
                        if (succes) {
                            const token = generate_token(db, email)
            
                            send_email(db, user.email, transport, "User confirmation",
                                "Please confirm your user by accessing this ",
                                `https://travel-website-with-mongodb-front-end-bszn.vercel.app/verify_${token}`)
                                .then(result => resolve("Email sent"))
                        }
                        else {
                            err && console.log(err)
                            reject("error")
                        }
                    })
                }

                else reject("error")
            })
        } catch (e) {
            // res.status(500).json({error:e.message})
            reject('error')
        }
    })
}