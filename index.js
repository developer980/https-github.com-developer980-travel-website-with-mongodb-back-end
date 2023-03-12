const express = require("express")
const app = express()
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const cors = require('cors')
const axios = require('axios');
const cheerio  = require("cheerio");
const pretty = require("pretty");
const e = require("express");
const src = require("./Search_User");
const { resolve } = require("path");
const nodemailer = require("nodemailer");
const { cursorTo } = require("readline");
const path = require("path")
const Search_User = require("./Search_User")
const verify_token = require("./verify_token")

// const db = require("./dbconfig")

const bcrypt = require('bcryptjs')

const multer = require("multer");
const { createBrotliCompress } = require("zlib");
const send_email = require("./email/send_email");
const verify_user = require("./user_auth/verify_user");
const get_favourites = require("./favourites/get_favourites");
const remove_fromFavourites = require("./favourites/remove_fromFavourites");
const expedia = require("./posts/expedia");

// const dbconfig = require("./dbconfig");
app.use(cors())
const connectionURl = process.env.MONGODB_URI;
const database = "travelMDB"
require('dotenv').config();
let elements = []
// let elements1 = []
let elements2 = []

// console.log(process.env.EML)
// console.log(process.env.PASS)
// console.log("URI: " + process.env.MONGODB_URI)

let db

mongoClient.connect(
    connectionURl,
    {useNewUrlParser:true},
    (err, cli) => {
        if(err) {
            console.log("Unable to connect to the database: " + err)
            return
        }

        db = cli.db(database)

        // db.collection('posts').insertOne({
        //     name:"Tudor",
        //     age:20
        // })
    },
)

// db.connect((err) => {
//     err ? console.log("Connection failed: " + err) : console.log("Succesfully connected")
// })

const transport = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EML,
        pass:process.env.PASS
    }
})

app.use(express.json())

app.post("/post_user", (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const token = req.body.token

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
            res.send("Email is invalid") 
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
            res.send("Email sent")
        }
    })


})

app.post("/verify_token", (req, res) => {
    const token = req.body.token
    const email = req.body.email

    verify_token(db, token, email)
        .then(result => res.send(result))
        .catch(reject => console.log("Token rejected"))
})

app.post("/search_user", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    Search_User(email, password, db)
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

    send_email(db, email, transport)
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
    get_favourites(db, email).then(result => res.send(result))
    // const favs = db.collection("users").find({ email: email }).project({
    //     _id: 0,
    //     favs:1
    // })

    // favs.forEach(data => {
    //     favs_list.push(data)
    // }, () => {        
    //     res.send(favs_list[0]);
    // })
})

app.post("/remove_fromFav", (req, res) => {
    const email = req.body.email
    const name = req.body.name

    remove_fromFavourites(db, name, email).then(result => res.send(result))
    // db.collection("users").update({ email: email }, {
    //         $pull: {
    //             "favs": {
    //                 name:name
    //         }
    //     }
    // })
    
    // const favs_list = []
    // const favs = db.collection("users").find({ email: email }).project({
    //     _id: 0,
    //     favs:1
    // })
    // favs.forEach(data => {
    //     console.log(data)
    //     favs_list.push(data)
    // }, () => {        
    //     res.send(favs_list[0]);
    // })
})

// app.post("/recovery_email", (req, res) => {})

app.post("/get_posts", (req, res) => {
    let keyWord = req.body.keyWord
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
        expedia(keyWord, checkIn, checkOut, elements1).then((result) => {
            console.log(result)
            resolve(result)
        })
        // axios.get(`https://www.expedia.com/Hotel-Search?destination=${keyWord}&startDate=${checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&endDate=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`).then((data) => {
        //     const $ = cheerio.load(data.data)
        //     $('.uitk-card').each(function () {
        //         const name = $(this).find(".uitk-layout-flex").find("h2")
        //         const price = $(this).find(".uitk-layout-flex").find(".uitk-layout-flex").find(".uitk-layout-flex").children(".uitk-layout-flex").children(".uitk-type-200")
        //         const location = $(this).find(".uitk-layout-flex").children(".uitk-spacing").find("div .truncate-lines-2")

        //         console.log("Location " + location.text())
        //         let url = $(this).find("a").attr("href")
        //         let img;

        //         if (url && !url.includes("https://www.expedia.com")) {
        //             url = "https://www.expedia.com" + $(this).find("a").attr("href")
        //         } 
                
                
        //       //  console.log("name: " + name.text())
        //       //  console.log("url: " + url)

        //         $(this).find(".uitk-gallery-carousel-items").children(".uitk-gallery-carousel-item-current").each(function () {
        //             img = $(this).find("img").attr("src")
        //         })

        //         elements1.push({
        //             name: name.text(),
        //             price: price.text().split(" ")[0].substring(1).replace(",", "") / 1.09,
        //             location:location.text(),
        //             img,
        //             url:[url]
        //         })
        //     })
        //     //console.log("l2 " + elements1.length)
        //     resolve(elements1)
        // })
    })

    console.log(`https://www.booking.com/searchresults.ro.html?ss=${keyWord}${"&checkin=" + checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&checkout=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`)

    const promise1 = new Promise((resolve) => {
        axios.get(`https://www.booking.com/searchresults.ro.html?ss=${keyWord}${"&checkin=" + checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&checkout=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`)
        .then((data) => {

            const $ = cheerio.load(data.data)
            !elements.length && $('.d20f4628d0').each(function (i, elem) {
                let rating_stars = 0
                //console.log("text " + $(this).text())
                const url_text = $(this).find(".ef8295f3e6").find(".fcab3ed991").text();
                const url_href = $(this).find(".ef8295f3e6").children("div").find("a").attr("href")
                const description = $(this).find(".ef8295f3e6").children(".d8eab2cf7f").text()
                const location = $(this).find(".ef8295f3e6").children("div").children(".a1fbd102d9").children("a").children("span").children(".f4bd0794db").text();
                const price_text = $(this).find('.fd1924b122').find(".fbd1d3018c ").text()
                const img = $(this).find(".c90a25d457").find("img").attr("src")
                //console.log(pretty(img.attr("src")))
                const price = price_text.split("lei")[0].split(".").join('')
                console.log("price " + price_text.split("lei")[0].split(".").join('') + " " + price_text.split("lei")[0].split(".").join('') / 4.90)
                let notes = ""
                
                if (description.includes("Proprietate Călătorii durabile")) {
                    notes = "Travel sustenabillity property"
                }
        
                $(this).find(".b978843432").find(".fbb11b26f5").children("span").each(function (item) {
                    rating_stars++
                })
                console.log("rating_stars: " + rating_stars)
                const converted_price = price / 4.90
                if (url_text && price){
                    //description.length ?
                    elements.push({
                        url_text,
                        url_href:[url_href],
                        rating_stars,
                        notes,
                        img,
                        price:[{
                            website:"booking.com",
                            value:price.replace("€", "").trim()
                        }],
                        location: location.replace("Arată pe hartă", " ")
                    })
                }
            })
            resolve(elements)
        })

    })
    
    Promise.all([promise, promise1]).then((values) => {

        const final_result = []

        const test_array1 = []

        for (let i = 0; i < values[1].length; i++) {
            for (let j = 0; j < values[1].length; j++) {
                if (i != j)
                    if (values[1][i].url_text == values[1][j].url_text) {
                        values[1].splice(j, j)
                    }
            }
        }
        for (let i = 0; i < values[0].length; i++) {
            for (let j = 0; j < values[0].length; j++) {
                if (i != j)
                    if (values[0][i].name == values[0][j].name) {
                        values[0].splice(j, j)
                    }
            }
        }

        const test_array = []
        for (let i = 0; i < values[0].length; i++){
            test_array.push(values[0][i].name)
        }

        for (let i = 0; i < values[1].length; i++){
            test_array1.push(values[1][i].url_text)
        }

        for (let i = 0; i < values[1].length; i++) {
            console.log(values[1][i].price)
            for (let j = 0; j < values[0].length; j++){
                //console.log(values[1][j].price)
                if (values[1][i].url_text == values[0][j].name) {
                    const price1 = values[1][i].price
                    const price2 = values[0][j].price

                    price1.push({
                        website:"expedia.com",
                        value:price2.toFixed(2)
                    })

                    values[1][i].url_href.push(values[0][j].url[0])
                }
                else if (i == values[1].length - 1) {
                   
                    if (values[0][j].img) {
                        let n_o_elems = 0
                        for (let k = 0; k < final_result.length; k++){
                            if (final_result[k].url_text == values[0][j].name)
                            {
                                n_o_elems++
                            }
                        }
                        
                        !n_o_elems && final_result.push({
                            url_text: values[0][j].name,
                            url_href: values[0][j].url,
                            location: values[0][j].location,
                            price: [{
                                website: "expedia.com",
                                value: values[0][j].price.toFixed(2)
                            }],
                            img: values[0][j].img
                        })
                    }
                }
                
            }
            values[1][i].price[0].value && final_result.push(values[1][i])
        }

        res.send(final_result)
    })
})

module.exports = function response(res, data) {
    res.send(data)
}
// process.env.PORT &&
app.listen(3001, () => {
    console.log("Server started :)")
})
            
module.exports = app