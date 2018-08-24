const {MqttSubscriber, MongoDataClient} = require('t4l-console-susbcriber'); 

const conf = require('./resources/config.json');
const monitor = new MqttSubscriber(
    {
        host: conf.mqtt.host,
        port: conf.mqtt.port,
        topic: conf.mqtt.ds_topic
    });

let dbName = 't4l_test2'
let url = 'mongodb://localhost:27017/' + dbName;
const client = new MongoDataClient(url, dbName);


monitor.onMessage((topic, message) => {
    console.log(message.toString())
    message = JSON.parse(message.toString());
    client.start().then((client) =>
    {
        client.insertOne(message);
    })
})    

monitor.init();