const axios = require("axios")
const cheerio = require("cheerio")

module.exports = function booking(keyWord, checkIn, checkOut) {
        
    let elements = []

    return new Promise((resolve) => {
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
}