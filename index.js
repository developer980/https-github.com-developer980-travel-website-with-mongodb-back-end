const express = require("express")
const app = express()
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const cors = require('cors')
const nodemailer = require("nodemailer");
const Search_User = require("./user_auth/search_User")
const verify_token = require("./user_auth/verify_token")

// const db = require("./dbconfig")

const bcrypt = require('bcryptjs')
const send_email = require("./email/send_email");
const verify_user = require("./user_auth/verify_user");
const get_favourites = require("./favourites/get_favourites");
const remove_fromFavourites = require("./favourites/remove_fromFavourites");
const expedia = require("./posts/expedia");
const booking = require("./posts/booking");
const create_finalList = require("./posts/create_finalList");
const post_user = require("./user_auth/post_user");
const generate_token = require("./user_auth/generate_token")

// const dbconfig = require("./dbconfig");
app.use(cors())
const connectionURl = process.env.MONGODB_URI;
const database = "travelMDB"
require('dotenv').config();
let elements = []
// let elements1 = []
let elements2 = []

let db

// mongoClient.connect(
//     connectionURl,
//     {useNewUrlParser:true},
//     (err, cli) => {
//         if(err) {
//             console.log("Unable to connect to the database: " + err)
//             return
//         }

//         db = cli.db(database)
//     },
// )

const transport = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EML,
        pass:process.env.PASS
    }
})


app.use(express.json())

app.post("/wake_up", (req, res) => {
    const message = req.body.message
    console.log(message)
})

app.post("/post_user", (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const token = req.body.token

    post_user(db, email, username, password, token, transport)
        .then(result => res.send(result))
        .catch(err => res.send(err))
})

app.post("/verify_token", (req, res) => {
    const token = req.body.token
    const email = req.body.email

    verify_token(db, token, email, "pending_users")
        .then(result => res.send(result))
        .catch(reject => console.log("Token rejected"))
})

app.post("/verify_userToken", (req, res) => {
    const token = req.body.token
    const email = req.body.email
    const response = []

    const result = db.collection(users).find({
        email:email
    })

    result.forEach((result, err) => {
        response.push(result)
    }, () => {
        response[0].token == token && res.send("succes")
    })
})

app.post("/confirm_user", (req, res) => {
    const email = req.body.email
    const token = req.body.token
    const collection = "users"
    const result = []
    
    console.log("email: " + email)
    
    db.collection("users").findOne({
        email:email
    }, (err, user) => {
        if (err) throw err;

        if (token == user.pass_token)
            user && res.send(user)
    })
})

app.post("/search_user", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    Search_User(email, transport, password, db)
        .then(result => res.send(result))
        .catch(error => res.send(error))
    
})


app.post("/delete_user", (req, res) => {
    const email = req.body.email;

    db.collection("users").deleteOne({ email: email })
    res.send("Account deleted")
})


app.post("/reset_email", (req, res) => {
    const email = req.body.email;

    const token = generate_token(db, email)

    send_email(db, email, transport, "Password reset", "Reset your password by accesing this", `https://travel-website-with-mongodb-front-end-bszn.vercel.app/resetPasswordfor_${token}`)
        .then(result => res.send(result))
        .catch(error => console.log("Email error: " + error))
})


app.post("/verify_user", (req, res) => {
    const token = req.body.token
    console.log("token: " + token)
    const email = req.body.email

    verify_user(db, email, token).then(result => res.send(result))
})


app.post("/reset_password", (req, res) => {
    const password = req.body.password
    const email = req.body.email
    const token = req.body.token
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    db.collection("users").updateOne({ email: email }, {
        $set: {
            "password": hashedPassword,
            "pass_token":''
        }
    })
    
    res.send("Password succesfully changed")
})

app.post("/add_tofav", (req, res) => {
    const name = req.body.name
    const link = req.body.link
    const price = req.body.price
    const id = req.body.id
    const email = req.body.email
    const img = req.body.img
    console.log("id: " + id)
    db.collection("users").updateOne({ "email" : email}, {
        $push: {
            "favs": {
                name: name,
                link: link,
                img: img,
                price:price
            }
        }
    })

})

app.post("/get_favourites", (req, res) => {
    const email = req.body.email
    db && get_favourites(db, email).then(result => res.send(result))
})

app.post("/remove_fromFav", (req, res) => {
    const email = req.body.email
    const name = req.body.name

    remove_fromFavourites(db, name, email).then(result => res.send(result))
})

// app.post("/recovery_email", (req, res) => {})

app.post("/get_posts", (req, res) => {
    let keyWord = req.body.keyWord
    console.log("searching")
    const checkIn = {
        day:req.body.parameters.checkIn.day,
        month:req.body.parameters.checkIn.month,
        year:req.body.parameters.checkIn.year
    }
    const checkOut = {
        day:req.body.parameters.checkOut.day,
        month:req.body.parameters.checkOut.month,
        year:req.body.parameters.checkOut.year
    }
   // console.log("checkIn: " + checkIn)
   // console.log("checkOut: " + checkOut)
    let endpoint = `https://www.booking.com/searchresults.ro.html?ss=${keyWord}`
    //console.log(`https://www.booking.com/searchresults.ro.html?ss=${keyWord}`)

    elements = []
    // elements1 = []
    elements2 = []

    //

    console.log(`https://www.expedia.com/Hotel-Search?destination=${keyWord}&startDate=${checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&endDate=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`)

    const promise = new Promise((resolve) => {
        expedia(keyWord, checkIn, checkOut).then((result) => resolve(result))
    })

    console.log(`https://www.booking.com/searchresults.ro.html?ss=${keyWord}${"&checkin=" + checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&checkout=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`)

    const promise1 = new Promise((resolve) => {
        booking(keyWord, checkIn, checkOut).then(result => resolve(result))
    })
    
    Promise.all([promise, promise1]).then((values) => {
        create_finalList(values).then(list => res.send(list))
    })
})

app.listen(3001, () => {
    console.log("Server started :)")
})
            
module.exports = app