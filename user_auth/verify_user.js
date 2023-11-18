const { resolve } = require("path")

module.exports = function verify_user(db, email, token) {
    const result = []
    
    return new Promise((resolve, reject) => {
            const response = db.collection("users").find({ email: email })
            response.forEach(data => {
                result.push(data)
            }, () => {
                console.log(result[0])
                if (result[0].pass_token && token == result[0].pass_token) {
                    console.log("Token matches")
                    resolve("Token matches")
                }
                // res.send(result[0])
            })
        }
    )
}