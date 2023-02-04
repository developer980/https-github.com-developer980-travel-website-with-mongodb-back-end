const axios = require('axios');
const cheerio = require("cheerio");
const pretty = require("pretty")


function function1(destination) {
    axios.get(`https://www.expedia.com/Hotel-Search?destination=${destination}`).then(response => {
        const $ = cheerio.load(response.data);

        $(".uitk-spacing").each(() => {
            console.log($(this).find("h2").text())
        })
        //console.log(pretty($.html()))
    })
}

module.exports = {
    function1,
};