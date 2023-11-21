const axios = require("axios")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const pretty = require("pretty")



module.exports = async function booking(keyWord, checkIn, checkOut) {
        
    let elements = []
    const browser = await puppeteer.launch({
        headless:false
    })

    const page = await browser.newPage();
    await page.goto(`https://www.booking.com/searchresults.ro.html?ss=${keyWord}${"&checkin=" + checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&checkout=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`, {
        waitUntil:'domcontentloaded'
    })

    await page.evaluate(() => {
        window.scrollTo(0, document.body.height / 2)
    })

    await page.waitForTimeout(10000)
    // await page.screenshot({ path: 'screenshot.png' });

    // await page.waitForSelector('.c82435a4b8', {visible:true})

    await page.setViewport({
        width:1200,
        height:1200
    })

    const html = await page.content()
    const title = await page.evaluate(() => document.title)
    //.c82435a4b8 .d6767e681c .aab71f8e4e"
    const list = await page.evaluate(() => Array.from(document.querySelectorAll(".c82435a4b8 .d6767e681c .aab71f8e4e"), (item) => {
        return {
            url_text:item.querySelector("a .f6431b446c").innerText
        }
    }))

    console.log(list)
    //console.log(title)
   // const list = await page.$$("div")


    for(const item of list){
        // const url_text = '';
        // const url_href = '';
        // try{
        //     url_text = await page.evaluate(elem => elem.querySelector(""))
        // }

       // console.log(await page.evaluate(el => el.querySelector('div').textContent, item))
        // let elem = "";
        // try{
        //     elem = await page.evaluate(el => el.querySelector('.c066246e13 > .c1edfbabcb > .aca0ade214 > div > .f02fdbd759 > .aaee4e7cd3  > div > div > div > h3 > a > .a15b38c233').textContent, item)
        // }
        // catch (err){
        //     console.log("ERROR: ")
        //     console.log(err)
        // }

        // console.log(elem)
        //const url_ = '';
    }
    return elements

    // return new Promise((resolve) => {
    //     axios.get(`https://www.booking.com/searchresults.ro.html?ss=${keyWord}${"&checkin=" + checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&checkout=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`)
    //         .then((data) => {
        
            

    //             // console.log("collecting data")
    //             // console.log(data)
    //             const $ = cheerio.load(data.data)

    //            // console.log($.html())
    //             console.log("divs")
    //             !elements.length && $('.c82435a4b8').each(function (i, elem) {
    //                 let rating_stars = 0
    //                 //console.log("text " + $(this).text())

    //                 console.log("scraped element:")
    //                 console.log(pretty($(this).html()))

    //                 const url_text = $(this).find("h3").find(".f6431b446c").text();
    //                 const url_href = $(this).find("h3").find("a").attr("href")
    //                 // console.log(pretty(url_text))
    //                 const description = $(this).find(".ef8295f3e6").children(".d8eab2cf7f").text()
    //                 const location = $(this).find(".b0db0e8ada").find(".aee5343fdb ").text();
    //                 console.log(location)
    //                 const price_text = $(this).find('.c5ca594cb1').find('span').text()
    //                 const img = $(this).find("img").attr("src")
    //                 //console.log(pretty(img.attr("src")))
    //                 const price = price_text.split("lei")[0].split(".").join('')
    //                 // console.log("price " + price_text.split("lei")[0].split(".").join('') + " " + price_text.split("lei")[0].split(".").join('') / 4.90)
    //                 let notes = ""

    //                 // console.log("url_href:")
    //                 // console.log(url_href)
                    
    //                 if (description.includes("Proprietate Călătorii durabile")) {
    //                     notes = "Travel sustenabillity property"
    //                 }
            
    //                 $(this).find(".d6767e681c").find(".a455730030").children("span").each(function (item) {
    //                     rating_stars++
    //                 })
    //                 console.log("rating_stars: " + rating_stars)
    //                 const converted_price = price / 4.90
    //                 const new_element = {
    //                     url_text,
    //                     url_href:[url_href],
    //                     rating_stars,
    //                     notes,
    //                     img,
    //                     price:[{
    //                         website:"booking.com",
    //                         value:price.replace("€", "").trim()
    //                     }],
    //                     location: location.replace("Arată pe hartă", " ")
    //                 }

    //                 // console.log(new_element)

    //                 if (url_text && price){
    //                     //description.length ?
    //                     elements.push(new_element)
    //                 }
    //             })
    //         resolve(elements)
    //     })
    // })
}