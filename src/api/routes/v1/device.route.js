const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/device.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");
const Device = require("../../models/device.model");

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param("deviceId", controller.load);

router.route("/").get(controller.list).post(controller.create);

router
  .route("/:deviceId")
  .get(authorize(LOGGED_USER), controller.get)
  .delete(authorize(LOGGED_USER), controller.remove);

router
  .route("/addDevice")
  .post(authorize(LOGGED_USER), async function (req, res) {
    try {
      let user_trans = req.user.transform();

      let { macAddr, ipAddr, deviceId, deviceName } = req.body;
      let record_check_exist = await Device.findOne({ macAddr }).lean();
      if (record_check_exist) {
        console.log("existed,no created");

        return res.json({
          user: user_trans,
          device: record_check_exist,
          channel: user_trans.email + "/" + record_check_exist.id,
        });
      } else {
        console.log("Not exist, created");
      }
      let data = {
        macAddr,
        ipAddr,
        deviceId,
        deviceName,
        userId: req.user.transform().id,
      };

      const device = new Device(data);

      const savedDevice = await device.save();

      let device_trans = savedDevice.transform();
      return res.status(200).json({
        user: user_trans,
        device: device_trans,
        channel: user_trans.email + "/" + device_trans.id,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        error: "Có lỗi xảy ra",
      });
    }
  });

router.route("/publish").post(function (req, res) {
  const mqttClient = req.app.locals.mqttClient;
  const { message, topic } = req.body;
  mqttClient.sendMessage(topic, message);
  console.log(topic, message);
  res.status(200).send("Sent");
});
router.route("subscribe").post(function (req, res) {
  const mqttClient = req.app.locals.mqttClient;
  const { topic } = req.body;

  mqttClient.subscribe(topic);
  res.status(200).send("Subscribed");
});

router.route("/sensorData").post(controller.getSensorData);
module.exports = router;
