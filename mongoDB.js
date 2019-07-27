var MongoClient= require("mongodb");
var DBConfig = require('./Configs/config');

const connectionUrl = DBConfig.connectionUrl;
const databaseName = DBConfig.databaseName;

const SaveImageData= async (urls,callback)=>{
    try {
        MongoClient.connect(
            connectionUrl,
            {
              useNewUrlParser: true
            },
            (error, client) => {
              if (client) {
                const db = client.db(databaseName);
                urls.forEach(element => {
                db.collection("Bookmarks").find({url: element.url}).toArray(function(err, result) {
                if (err) {console.log(err);return false;}
                else if(result.length===0)
                db.collection("Bookmarks").insertOne(
                {
                  url: element.url,
                    imageName: element.imageName,
                    hitCount:0
                    },
                    (err, result) => {
                        if (err) {
                        console.log("Unable to Insert");
                        return false;
                        } else if (result) {
                        //console.log(result.ops);
                        return true;
                        }
                    }
                ); 
                });        
              });
              } else if (error) {
                console.log("Unable to Connect");
                return false;
              }
            }
          )
          callback();
    } catch (error) {
        callback();
    }
}
module.exports =SaveImageData;