const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("pages/login", {
    layout: null,
  });
});

router.get("/register", (req, res) => {
  res.render("pages/register", {
    layout: null,
  });
});

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/dashboard", (req, res) => {
  let { deviceId } = req.query;
  if (typeof deviceId !== "undefined") {
    console.log(deviceId);
    res.render("pages/dashboard", {
      layout: "main",
      title: "Dashboard",
      deviceId,
    });
  } else {
    res.render("pages/list_device", {
      layout: "main",
      title: "Danh sách thiết bị",
    });
  }
});

router.get("/setting_device", (req, res) => {
  res.render("pages/setting_device", {
    layout: "main",
    title: "Cài đặt thiết bị",
  });
});

router.get("/list_device", (req, res) => {
  res.render("pages/list_device", {
    layout: "main",
    title: "Danh sách thiết bị",
  });
});
module.exports = router;
