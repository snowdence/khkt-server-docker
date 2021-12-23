const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/device.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");

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
