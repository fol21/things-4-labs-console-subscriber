const MqttSubscriber = require(''); 

const conf = require('./resources/config.json');
const monitor = new MqttSubscriber(
    {
        host: conf.mqtt.host,
        port: conf.mqtt.port
    });
    
monitor.init();