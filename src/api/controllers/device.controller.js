const httpStatus = require("http-status");
const { omit } = require("lodash");
const Device = require("../models/device.model");
const SensorData = require("../models/sensor_data.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const device = await Device.get(id);
    req.locals = { device };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.device.transform());

exports.getSensorData = async (req, res) => {
  try {
    let { deviceId, limit } = req.body;

    if (limit === undefined) {
      limit = 10;
    }
    let lsSensor = await SensorData.find({
      deviceId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    res.json(lsSensor);
  } catch (err) {
    console.log(err);
    res.json({
      error: "Có lỗi xảy ra",
    });
  }
};
/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const device = new Device(req.body);
    const savedUser = await device.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    res.json({
      error: "Có lỗi xảy ra",
    });
  }
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  console.log(req.query);
  try {
    const devices = await Device.list(req.query);
    const transformeddevices = devices.map((device) => device.transform());
    res.json(transformeddevices);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
