var MongoClient = require("mongodb");
var DBConfig = require('./Configs/config');
var moment = require('moment');
const connectionUrl = DBConfig.connectionUrl;
const databaseName = DBConfig.databaseName;

const SaveImageData = async (ObjBookmark, callback) => {
  try {
    MongoClient.connect(
      connectionUrl, {
        useNewUrlParser: true
      },
      (error, client) => {
        if (client) {
          const db = client.db(databaseName);
          ObjBookmark.bookmakArray.forEach(element => {
            db.collection("Bookmarks").find({
              url: element.url
            }).toArray(function (err, result) {
              if (err) {
                console.log(err);
                return false;
              }
              /*If url is present*/
              else if(result.length >0){
                let existingUser = result[0].users[ObjBookmark.userID];
                /*If url is present, and user is new*/
                if(!existingUser){   
                  let newUser={...result[0].users};
                  newUser[ObjBookmark.userID]={
                    hitCount:0,
                    dateAdded:moment().format(),
                    dateModified:moment().format()
                  }
                    db.collection("Bookmarks").updateOne({_id:result[0]._id},{ $set:{users:newUser}},
                      (err,result)=>{
                      if (err) {
                        console.log("Unable to Update");
                      } else if (result){
                        //console.log(result.ops);
                      }
                    })
                }
              }
              /*If url is not present*/
              else if (result.length === 0) {
                let userInfo={};
                userInfo[ObjBookmark.userID]={
                  hitCount:0,
                  dateAdded:moment().format(),
                  dateModified:moment().format()
                }
                db.collection("Bookmarks").insertOne({
                    url: element.url,
                    imageName: element.imageName,
                    users: userInfo
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
              }
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
module.exports = SaveImageData;