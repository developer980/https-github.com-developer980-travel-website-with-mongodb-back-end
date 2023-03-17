const bcrypt = require('bcryptjs')
const generate_token = require("./generate_token")
const send_email = require("../email/send_email")

module.exports = function Search_User(email, transport, password, db) {
    return new Promise((resolve, reject) => {
        const result = []
        try {
            const response = db.collection("users").find({ email: email })
            response.forEach(data => {
                //if(response.email && response.password)
                console.log(data)
                result.push({
                    email: data.email,
                    password: data.password
                })
            }, () => {
                console.log(result[0])
                result[0].email && password ? bcrypt.compare(password, result[0].password, (err, succes) => {
                    console.log("password matches")
                    
                    if (succes) {
                        const token = generate_token(db, email)

                        send_email(db, result[0].email, transport, "User confirmation",
                            "Please confirm your user by accessing this ",
                            `https://travel-website-with-mongodb-front-end-bszn.vercel.app/verify:${token}`)
                            .then(result => resolve("Email sent"))
                    }
                    else {
                        err && reject("error")
                    }
                    // succes ? resolve({
                    //     email: result[0].email,
                    //     username: result[0].username
                    // }) : reject("error")
                    // err && reject("error")
                })
                    :
                reject('error')
            })
        } catch (e) {
            // res.status(500).json({error:e.message})
            reject('error')
        }
    })
}