const bcrypt = require('bcryptjs')

module.exports = function Search_User(email, password, db) {
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
                if (result[0]) {
                    if(password) bcrypt.compare(password, result[0].password, (err, succes) => {
                        console.log("password matches")
                        // succes ? res.send({
                        //     email: result[0].email,
                        //     username: result[0].username
                        // }) : res.send("error")
                        // err && res.send("error")

                        if (succes) return {
                            email: result[0].email,
                            username: result[0].username
                        }
                        else if (!succes || err) return "error"
                    })
                    else return "error"
                }
            })
        } catch (e) {
            // res.status(500).json({error:e.message})
            return "error"
        }
}