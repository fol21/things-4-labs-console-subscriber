const readline = require('readline');
const mqtt = require('mqtt');
const program = require('commander');



class MqttSubscriber {

    constructor(config = {}) {

        this.program = program
            .version('0.1.0')
            .option('-t, --topic <n>', 'Choose topic to be subscribed', (val) => {
                return val
            })
            .option('-c, --context <n>', 'Add context to incoming messages')
            .option('-h, --host <n>', 'Overrides pre-configure host')
            .option('-p, --port <n>', 'Overrides pre-configure port', parseInt)
            .option('-C, --configure <items>', 'Name of configuration topic and json', (val) => {
                return val.split(',');
            })
            .parse(process.argv);

        this.host = program.host || config.host;
        this.port = program.port || config.port;
        this.configure = (config.configure) ? config.configure : null;

        this.messageCallback = null;

        this.topic = null;
        if (program.topic || program.configure) {
            if (program.topic) this.topic = program.topic;
            if (program.configure) this.configure = program.configure;
        } else {
            console.log("Topic or Configuration is required (run program with -t <topic> or -C <configuration> flag)")
            process.exit();
        }

    }

    _defaultMessageCallback(topic, message) {
        // message is Buffer
        if (program.context) console.log(`${program.context} ${message}`);
        else console.log(message.toString());

    }

    /**
     * 
     * 
     * @param {function (topic,message)} callback 
     * @memberof MqttSubscriber
     */
    onMessage(callback) {
        this.messageCallback = callback;
    }

    //Parses Configuration 
    parseConfigure() {
        let body = null;
        if (this.configure.constructor === Array)
        {
            body = {
                topic: this.configure[0],
                json: this.configure[1],
                configuration: JSON.parse(this.configure[1])
            }
        }
        else {
            body = {
                topic: this.configure.topic,
                json: this.configure.json,
                configuration: JSON.parse(this.configure.json)
            }
        }
        return body

    }

    /**
     * Initialize console application
     * Use after setup every callback
     * Must be called only once
     * @memberof MqttSubscriber
     */
    init() {

        //program.parse(process.argv);

        this.client = mqtt.connect({
            host: this.host,
            port: this.port
        });
        this.client.on('connect',
            () => {
                if (this.configure) {
                    let conf = this.parseConfigure()
                    this.client.publish(conf.topic, conf.json)
                    console.log(`Sent Configuration ${conf.json} to ${conf.topic}`)
                }
                if (this.topic) {
                    console.log(`Connected, Listening to:
                host: ${this.host} 
                port: ${this.port} 
                topic: ${this.topic}`);
                    this.client.subscribe(this.topic);
                } else {
                    process.exit();
                }
            });
        this.client.on('message', this.messageCallback || this._defaultMessageCallback)
    }


}

module.exports = MqttSubscriber;