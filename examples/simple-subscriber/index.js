const momment = require('moment');
const _ = require('lodash/collection');
const plotly = require('plotly')('fol21', 'y32TAWwBymoFOnT0vkvE');
const {
    MqttSubscriber,
    MongoDataClient
} = require('t4l-console-susbcriber');

const conf = require('./resources/config.json');
const monitor = new MqttSubscriber({
    host: conf.homolog.mqtt.host,
    port: conf.homolog.mqtt.port,
    topic: conf.homolog.mqtt.ds_topic
});

let dbName = 't4l_test2'
let url = 'mongodb://localhost:27017/' + dbName;
const client = new MongoDataClient(url, dbName);

let count = 0;
let graphIndex = 1;

monitor.onMessage((topic, message) => {
    console.log(message.toString())
    message = JSON.parse(message.toString());
    client.start().then((client) => {
        if(message.device == "esp32"){
            message.main = message.temperature;
        }
        client.insertOne(message);
        if (count >= 5) {
            count = 0;
            client.collectData(5).then((chunk) => {
                
                // Separetes Data per device
                let bundles = [];
                conf.homolog.devices.forEach(device => {
                    bundles.push({
                        device:device,
                        chunk:[]
                    });
                });

                //Separation
                chunk.forEach(element => {
                    bundles.find(b => b.device == element.data.device).chunk.push(element);
                });
                

                let graphData = [];
                bundles.forEach(bundle => {
                    
                    let timeseries = _.map(_.map(bundle.chunk, 'timestamp'), (ts) => {
                        return momment(ts).format("YYYY-MM-DD HH:mm:ss");
                    });
                    let temps = _.map(bundle.chunk, 'data.main');
                    graphData.push({
                        x: timeseries,
                        y: temps,
                        name: bundle.device,
                        type: "scatter"
                    });
                });

                var layout = {
                    xaxis: {
                      title: "Data e Hora",
                      autorange: true
                    },
                    yaxis: {
                      title: "Temperatura [C]",
                      autorange: true
                    }
                  };
                  var graphOptions = {layout: layout, filename: "temp-devices", fileopt: "overwrite"};
     
                plotly.plot(graphData, graphOptions, function (err, msg) {
                    if(err)
                        console.log(err);
                    else 
                    {
                        console.log(msg);
                        graphIndex++;
                    }
                });
            });
        }
    })
    count++;
})

monitor.init();

// const plotly = require('plotly')('fol21', 'y32TAWwBymoFOnT0vkvE');

// var data = [
//   {
//     x: ["2013-10-04 22:23:00", "2013-11-04 22:23:00", "2013-12-04 22:23:00"],
//     y: [1, 3, 6],
//     type: "scatter"
//   }
// ];
// var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
// plotly.plot(data, graphOptions, function (err, msg) {
//     console.log(msg);
// });