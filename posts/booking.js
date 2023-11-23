const axios = require("axios")
const cheerio = require("cheerio")
const pretty = require("pretty")
const puppeteer = require("puppeteer")
require("dotenv").config()

module.exports = async function booking(keyWord, checkIn, checkOut) {
        
    let elements = []
    const browser = await puppeteer.launch({
        headless:false,
        executablePath:process.env.PUPPETEER_EXECUTABLE_PATH
            // process.env.NODE_ENV === "production"
            //     ? process.env.PUPPETEER_EXECUTABLE_PATH
            //     : puppeteer.executablePath()
        
    })

    const page = await browser.newPage()

    await page.setUserAgent('page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")')

    await page.goto(`https://www.booking.com/searchresults.ro.html?ss=${keyWord}${"&checkin=" + checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&checkout=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`)
    
    const list = await page.evaluate(() => Array.from(document.querySelectorAll(".c82435a4b8 h3 a .f6431b446c"), (item) => item.innerText))

    console.log(list)

    return new Promise((resolve) => {


        // axios.get(`https://www.booking.com/searchresults.ro.html?ss=${keyWord}${"&checkin=" + checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&checkout=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`)
        //     .then((data) => {
        
            
                
        //         // console.log("collecting data")
        //         // console.log(data)
        //         const $ = cheerio.load(data.data)

        //         console.log($.html())
        //         !elements.length && $('.c82435a4b8').each(function (i, elem) {
        //             let rating_stars = 0
        //             //console.log("text " + $(this).text())
                    
        //             const url_text = $(this).find("h3").find(".f6431b446c").text();
        //             const url_href = $(this).find("h3").find("a").attr("href")
        //             // console.log(pretty(url_text))
        //             const description = $(this).find(".ef8295f3e6").children(".d8eab2cf7f").text()
        //             const location = $(this).find(".b0db0e8ada").find(".aee5343fdb ").text();
        //             console.log(location)
        //             const price_text = $(this).find('.c5ca594cb1').find('span').text()
        //             const img = $(this).find("img").attr("src")
        //             //console.log(pretty(img.attr("src")))
        //             const price = price_text.split("lei")[0].split(".").join('')
        //             // console.log("price " + price_text.split("lei")[0].split(".").join('') + " " + price_text.split("lei")[0].split(".").join('') / 4.90)
        //             let notes = ""

        //             // console.log("url_href:")
        //             // console.log(url_href)
                    
        //             if (description.includes("Proprietate Călătorii durabile")) {
        //                 notes = "Travel sustenabillity property"
        //             }
            
        //             $(this).find(".d6767e681c").find(".a455730030").children("span").each(function (item) {
        //                 rating_stars++
        //             })
        //             console.log("rating_stars: " + rating_stars)
        //             const converted_price = price / 4.90
        //             const new_element = {
        //                 url_text,
        //                 url_href:[url_href],
        //                 rating_stars,
        //                 notes,
        //                 img,
        //                 price:[{
        //                     website:"booking.com",
        //                     value:price.replace("€", "").trim()
        //                 }],
        //                 location: location.replace("Arată pe hartă", " ")
        //             }

        //             // console.log(new_element)

        //             if (url_text && price){
        //                 //description.length ?
        //                 elements.push(new_element)
        //             }
        //         })
        //     resolve(elements)
        // })

        resolve(elements)
    })
}