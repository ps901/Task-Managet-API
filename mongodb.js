// CRUD OPERATIONS

//go and search mongodb driver api
// on mongodb npm

//Note that we have to use .toArray with method like find to get an array back
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";
const ObjectID = mongodb.ObjectID;

//up thing can be implemented by object destructuring as require returns object
// const { MongoClient, ObjectID} = require("mongodb");

// const id = new ObjectID();

//Object Id code
// console.log(id);
// first 4 byte contains time stamp id.getTimeStamp()
// console.log(id.id.length);
// console.log(id.toHexString());

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true  }, (error, client) => {
    if(error) {
        return console.log("Unable to connect to DB");
    } 
    
    const db = client.db(databaseName);

    //Insert 
    // db.collection("users").insertOne({
    //     name: "Vikram",
    //     age: 22
    // }, (err, result) => {
    //     if(err) 
    //         return console.log("Unable to insert user");
    //     console.log(result.ops);
    // })

    // db.collection("users").insertMany([
    //     {
    //         name: "jen",
    //         age: 28
    //     },
    //     {
    //         name: "Gunther",
    //         age: 27
    //     }
    // ], (err, result) => {
    //     if(err)
    //         return console.log("Unable to insert");
    //     console.log(result.ops);
    // })

    //READ
    // db.collection("users").findOne({_id: ObjectID("5eee3f781ffe098a14dff315")}, (err, user) => {
    //     if(err) 
    //         return console.log("Unable to fetch");
    //     console.log(user);
    // })

    //find returns a cursor (see cursor in api docs)
    // db.collection("users").find({age: 27}).count((error, count) => {
    //     console.log(count);
    // });

    // db.collection("tasks").findOne({_id: ObjectID("5eee3a570582f8893857e16a")}, (err, result) =>{
    //     console.log(result);
    // })

    // db.collection("tasks").find({completed: true}).toArray((err, result)=>{
    //     console.log(result);
    // })


    //UPDATE
    //can also store in a variable and use then on the variable like this
    // const updatePromise = db.collection("users").updateOne({_id: ObjectID("5eed461e4ebc075de494e374")}, 
    // {
    //     //increment age by 1
    //     $inc: {
    //         age: 1
    //     }
    // })

    updatePromise.then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })

    //$set updates only mentioned thing, else mention whole thing


    // db.collection("tasks").updateMany({completed: true}, { $set: {completed: false} }).then((result)=> {
    //     console.log(result.modifiedCount);
    // }).catch((err)=>{
    //     console.log(err);
    // })

    //DELETE
    // db.collection("users").deleteMany({
    //     age: 27
    // }).then((result) => {
    //     console.log(result);
    // }).catch((err) => {
    //     console.log(error);
    // })

    db.collection("tasks").deleteOne({
        description: "food"
    }).then((result)=>{
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })
});

