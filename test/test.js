const MqttSubscriber = require('../index')
let mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

let MongoDataClient = require('../src/db/MongoDataClient');

const conf = require('./resources/config.json');
//var url = `mongodb://${conf.mongodb.user}:${conf.mongodb.password}@ds018248.mlab.com:18248/t4l-test-db`;
let url = 'mongodb://localhost:27017/t4l_test2';

let client = new MongoDataClient(url, 't4l_test2');

let values = [];
for (let index = 0; index < 2; index++) {
    values.push(Math.random());
}

client.start()
.then((client) =>
 
client.insertMany(values).then((client) =>
{
    //client.insertMany([Math.random(), Math.random()]);
    client.deleteLatests(1).then((client) => 
    {
        client.collectData();
    });
} 
))

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db(conf.mongodb.database);
//     // dbo.createCollection("sensorData", function (err, res) {
//     //     if (err) throw err;
//     //     console.log("Collection created!");

//     // });
//     var myobj = {
//         timestamp: Date.now(),
//         data: 1000 + 1000*Math.random()
//     };
//     dbo.collection("sensorData").insertOne(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });

//     dbo.collection("sensorData").find({}).toArray(function (err, result) {
//         if (err) throw err;
//         result.forEach(element => {
//             console.log(element._id);
//         });
//         db.close();
//     });
// });


// const monitor = new MqttSubscriber(
//     {
//         host: conf.mqtt.host,
//         port: conf.mqtt.port,
//         configure:conf.stream
//     });

// monitor.init(()=> console.log("Callback Called!"));

//monitor.sendConfiguration("001/stream:type",'{\"id\" : 2}');


// let mqtt = require('mqtt')
// let client = mqtt.connect({
//   host: 'localhost',
//   port: 1883
// });

// client.on('connect', function () {
//   //client.subscribe('test')
//   console.log("Connected.");
//   for(let i=0;i < 5;i++) client.publish('test', Math.random().toString());
// })

// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString())
// })