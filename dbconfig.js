const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const connectionURl = process.env.MONGODB_URI;
const database = "travelMDB"


let db

module.exports.connect = function () {
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
            return db
        }
    )
}

module.exports.getClient = function () {
    return db
}