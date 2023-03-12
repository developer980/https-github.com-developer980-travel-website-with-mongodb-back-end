module.exports = function remove_fromFavourites(db, name, email) {
    return new Promise((resolve, reject) => {
        db.collection("users").update({ email: email }, {
            $pull: {
                "favs": {
                    name:name
            }
        }
        })
    
        const favs_list = []
        const favs = db.collection("users").find({ email: email }).project({
            _id: 0,
            favs:1
        })
        favs.forEach(data => {
            console.log(data)
            favs_list.push(data)
        }, () => {        
            resolve(favs_list[0]);
        })
    })
}