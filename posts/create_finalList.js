module.exports = function create_finalList(values) {
    return new Promise((resolve) => {
        console.log("values: ")
        console.log(values[0])
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
        
        console.log("final_result")
        // console.log(final_result)
        resolve(final_result)
    })
}