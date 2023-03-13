const bcrypt = require('bcryptjs')
module.exports = function Search_User(email, password, db) {
    return new Promise((resolve, reject) => {
        const result = []
        try {
            const response = db.collection("users").find({ email: email })
            response.forEach(data => {
                //if(response.email && response.password)
                console.log(data)
                result.push({
                    email: data.email,
                    username: data.username,
                    password: data.password,
                    id: data._id
                })
            }, () => {
                console.log(result[0])
                result[0] && password ? bcrypt.compare(password, result[0].password, (err, succes) => {
                    console.log("password matches")
                    succes ? resolve({
                        email: result[0].email,
                        username: result[0].username
                    }) : reject("error")
                    err && reject("error")
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