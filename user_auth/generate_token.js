module.exports = function generate_token(db, email) {
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

    return token
}