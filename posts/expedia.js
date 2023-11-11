const axios = require('axios');
const cheerio  = require("cheerio");

module.exports = function expedia(keyWord, checkIn, checkOut) {

    let elements1 = []
    let elements2 = []

    return new Promise((resolve) => {
        // axios.get(`https://www.expedia.com/Hotel-Search?destination=${keyWord}&startDate=${checkIn.year + "-" + checkIn.month + "-" + checkIn.day}${"&endDate=" + checkOut.year + "-" + checkOut.month + "-" + checkOut.day}`).then((data) => {
            // if(data.data){
            // const $ = cheerio.load(data.data)
            // $('.uitk-card').each(function () {
            //     const name = $(this).find(".uitk-layout-flex").find("h4")
            //     const price = $(this).find(".uitk-layout-flex").find(".uitk-layout-flex").find(".uitk-layout-flex").children(".uitk-layout-flex").children(".uitk-type-200")
            //     const location = $(this).find(".uitk-layout-flex").children(".uitk-spacing").find("div .truncate-lines-2")

            //     // console.log("Location " + location.text())
            //     let url = $(this).find("a").attr("href")
            //     let img;

            //     if (url && !url.includes("https://www.expedia.com")) {
            //         url = "https://www.expedia.com" + $(this).find("a").attr("href")
            //     } 
                
                
            // //  console.log("name: " + name.text())
            // //  console.log("url: " + url)
                
            //     // console.log("expedia: " + name)

            //     $(this).find(".uitk-gallery-carousel-items").children(".uitk-gallery-carousel-item-current").each(function () {
            //         img = $(this).find("img").attr("src")
            //     })

            //     const new_element = {
            //         name: name.text(),
            //         price: price.text().split(" ")[0].substring(1).replace(",", "") / 1.09,
            //         location:location.text(),
            //         img,
            //         url:[url]
            //     }
            //     elements1.push(new_element)
            // })
            //console.log("l2 " + elements1.length)
                // console.log(elements1)
            // resolve(elements1)
        // })
        resolve(elements1)
    })
}