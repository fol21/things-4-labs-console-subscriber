const MqttSubscriber = require('../index') 

const conf = require('./resources/config.json');
const monitor = new MqttSubscriber(
    {
        host: conf.mqtt.host,
        port: conf.mqtt.port,
        configure:conf.stream
    });
    
monitor.init(()=> console.log("Callback Called!"));

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