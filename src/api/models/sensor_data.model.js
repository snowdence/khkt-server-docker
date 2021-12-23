const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const { env, jwtSecret, jwtExpirationInterval } = require("../../config/vars");

/**
 * User Roles
 */

/**
 * User Schema
 * @private
 */
const sensorDataSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    rawData: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Methods
 */
sensorDataSchema.method({
  transform() {
    const transformed = {};
    const fields = ["id", "deviceId", "rawData", "createdAt"];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

sensorDataSchema.statics = {
  list(query) {
    return this.find(query).sort({ createdAt: -1 }).exec();
  },
};
/**
 * @typedef Device
 */
module.exports = mongoose.model("SensorData", sensorDataSchema);
