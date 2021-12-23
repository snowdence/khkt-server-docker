const mqtt = require("mqtt");
const SensorData = require("./api/models/sensor_data.model");
const ObjectId = require("mongodb").ObjectID;
const Device = require("./api/models/device.model");
const { mosquitto } = require("./config/vars");

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = "mqtt://" + mosquitto.host;
    this.username = mosquitto.username; // mqtt credentials if these are needed to connect
    this.password = mosquitto.password;
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
      username: this.username,
      password: this.password,
    });

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe("#", { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on("message", function (topic, message) {
      try {
        console.log(
          `[Received] : ${topic.toString()} => ${message.toString()} `
        );

        if (topic.includes("/")) {
          let parseTopic = topic.split("/");

          let msgStr = message.toString();
          if (msgStr.startsWith("cs_report")) {
            //Device.findById(parseTopic[1], function (err, cur) {
            let deviceObj = {
              deviceId: ObjectId(parseTopic[1].toString()),
              rawData: msgStr,
            };
            const sensorData = new SensorData(deviceObj);
            sensorData
              .save()
              .then((sensorData) => console.log("Saved sensor data"))
              .catch((e) =>
                console.log("Co loi xay ra khi save sensor data", e)
              );
            //});
          }
          console.log(msgStr.toString());
        }
      } catch (err) {
        console.log("onMessage", err);
      }
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }

  logSensorData(data) {}

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    console.log("Da publish ", message);
    try {
      this.mqttClient.publish(topic, message);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = MqttHandler;
