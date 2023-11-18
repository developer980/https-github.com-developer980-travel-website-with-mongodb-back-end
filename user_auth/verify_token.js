module.exports = function verify_token(db, token, email, collection) {
    return new Promise((resolve, reject) => {
        //console.log(token)
        const response = []
        console.log("verifying...")
        const result = db.collection(collection).find({
            email:email
        })
    
        result.forEach(function (result, err) {
            err && console.log(err)
            console.log(result)
                response.push(result)
                //res.send(result)
        }, () => {
           // db.close()
            response[0].token == token && console.log(response[0].email)
            if (response[0].token == token) {
                db.collection("users").insertOne({
                    email: response[0].email,
                    username: response[0].username,
                    password: response[0].password
                })
                response[0] && resolve("Succesfully registered")
            }
            db.collection("pending_users").deleteOne({token:token})
        })
    })
}