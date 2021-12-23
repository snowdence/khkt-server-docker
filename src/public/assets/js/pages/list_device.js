"use strict";

$(document).ready(function () {
  let user = JSON.parse(localStorage.getItem("user"));

  console.log("List devices");

  function deleteDevice(deviceId) {
    fetch("v1/devices?userId=" + user.id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        window.location.replace("/list_device");
      })
      .catch((err) => console.log(err));
  }

  fetch("v1/devices?userId=" + user.id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      let html = "";
      for (let item of res) {
        html += `
      <div class="single-device">
        <a href="/dashboard?deviceId=${item.id}">${item.deviceName}</a>
        <a href="/v1/devices/${item.id}/delete" role="button" type="button" class="btn btn-secondary btn-sm ml-2">
          <i class="ti-settings mr-2"></i>
          Xoá
        </a>
      </div>
      <hr>
      `;
      }
      document.getElementById("list-devices").innerHTML = html;
      console.log(res);
    });
});
