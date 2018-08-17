const {MqttSubscriber} = require('t4l-console-susbcriber'); 

const conf = require('./resources/config.json');
const monitor = new MqttSubscriber(
    {
        host: conf.mqtt.host,
        port: conf.mqtt.port
    });
    
monitor.init();