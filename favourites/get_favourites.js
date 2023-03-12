module.exports = function get_favourites(db, email) {
    const favs_list = []
    return new Promise((resolve, reject) => {
        const favs = db.collection("users").find({ email: email }).project({
            _id: 0,
            favs:1
        })
    
        favs.forEach(data => {
            favs_list.push(data)
        }, () => {        
            resolve(favs_list[0]);
        })
    })
}