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
              else if(result.length >0){
                let existingUsers = result[0].users.filter((item)=>{
                  return item.id===ObjBookmark.userID;
                })
                if(existingUsers.length===0){
                  let newUser=[...result[0].users]
                  newUser.push({
                    id:ObjBookmark.userID,
                    hitCount:0,
                    dateAdded:moment().format(),
                    dateModified:moment().format()
                  })
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
              else if (result.length === 0) {
                let arrUser=[];
                arrUser.push({
                  id:ObjBookmark.userID,
                  hitCount:0,
                  dateAdded:moment().format(),
                  dateModified:moment().format()
                })
                db.collection("Bookmarks").insertOne({
                    url: element.url,
                    imageName: element.imageName,
                    users: arrUser,
                    hitCount: 0
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