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
const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      maxlength: 128,
    },
    macAddr: {
      type: String,
    },
    ipAddr: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Methods
 */
deviceSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "userId",
      "deviceId",
      "deviceName",
      "macAddr",
      "ipAddr",
      "createdAt",
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

deviceSchema.statics = {
  list(query) {
    return this.find(query).sort({ createdAt: -1 }).exec();
  },
  async get(id) {
    let device;

    if (mongoose.Types.ObjectId.isValid(id)) {
      device = await this.findById(id).exec();
    }
    if (device) {
      return device;
    }

    throw new APIError({
      message: "Device does not exist",
      status: httpStatus.NOT_FOUND,
    });
  },
};
/**
 * @typedef Device
 */
module.exports = mongoose.model("Device", deviceSchema);
