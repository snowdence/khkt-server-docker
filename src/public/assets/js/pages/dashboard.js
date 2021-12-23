"use strict";
$(document).ready(function () {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  apex_chart_three();
  let last_report = "";
  let chart_data = {
    categories: [],
    series_doam: [],
    series_nhietdo: [],
    series_doamdat: [],
    series_anhsang: [],
  };
  //relay 1 => tat , 0 =>bat
  //report|h|t|hs|lux|bom|quat|den|den2|nhietdotudong|doamtudong|anhsangtudong|anhsangtudong2|mua
  let sample_report_data = [
    "cs_report|30|21|50|300|1|0|0|0|35|30|200|100|1",
    "cs_report|80|20|60|400|1|1|0|0|35|30|200|100|1",
    "cs_report|28|19|20|800|1|0|1|0|35|30|200|100|1",
    "cs_report|22|28|90|900|1|0|0|1|35|30|200|100|1",
  ];
  function apex_chart_three() {
    var options = {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      series: [
        {
          name: "Độ ẩm",
          data: [],
        },
        {
          name: "Nhiệt độ",
          data: [],
        },
        {
          name: "Độ ẩm đất",
          data: [],
        },
        {
          name: "Ánh sáng",
          data: [],
        },
      ],

      xaxis: {
        type: "datetime",
        categories: [],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm:ss",
        },
      },
    };

    var chart = new ApexCharts(
      document.querySelector("#apex_chart_three"),
      options
    );

    chart.render();

    // document
    //   .getElementById("btn_update_chart")
    //   .addEventListener("click", update);

    // function update() {
    //   console.log("Update");
    //   let newDate = new Date("11 Feb 2017 GMT").getTime();
    //   function randomSeries() {
    //     var arr = [];
    //     for (var i = 0; i < 20; i++) {
    //       arr.push({
    //         x: newDate + 10000 * i,
    //         y: Math.floor(Math.random() * 100),
    //       });
    //     }

    //     return arr;
    //   }

    //   chart.updateSeries([
    //     {
    //       name: "Series 1",
    //       data: randomSeries(),
    //     },
    //     {
    //       name: "Series 2",
    //       data: randomSeries(),
    //     },
    //   ]);
    // }

    function parseReportMessage(msg) {
      let data = {
        humid: 0,
        temperature: 0,
        humid_soil: 0,
        lux: 0,
        bom: false,
        quat: false,
        den1: false,
        den2: false,
        conf_gh_nhietdo: 0,
        conf_gh_doam: 0,
        conf_gh_as1: 0,
        conf_gh_as2: 0,
        mua: false,
        auto_mode: false,
      };

      let ap = msg.split("|");
      if (ap.length != 15) {
        return "";
      } else {
        data.humid = ap[1];
        data.temperature = ap[2];
        data.humid_soil = ap[3];
        data.lux = ap[4];
        data.bom = ap[5] == "1" ? true : false;
        data.quat = ap[6] == "1" ? true : false;
        data.den1 = ap[7] == "1" ? true : false;
        data.den2 = ap[8] == "1" ? true : false;
        data.conf_gh_doam = ap[9];
        data.conf_gh_doam = ap[10];
        data.conf_gh_doam = ap[11];
        data.conf_gh_doam = ap[12];
        data.mua = ap[13] == "1" ? true : false;
        data.auto_mode = ap[14] == "1" ? true : false;
      }
      return data;
    }
    function processListReportCmd(listMsg) {
      let listData = {
        categories: [],
        series_doam: [],
        series_nhietdo: [],
        series_doamdat: [],
        series_anhsang: [],
      };
      for (let item of listMsg) {
        let itemParsed = parseReportMessage(item.rawData);
        if (itemParsed === "") {
          continue;
        }
        listData.categories.unshift(new Date(item.createdAt).getTime());
        listData.series_doam.push({
          x: new Date(item.createdAt).getTime(),
          y: itemParsed.humid,
        });
        listData.series_nhietdo.push({
          x: new Date(item.createdAt).getTime(),
          y: itemParsed.temperature,
        });
        listData.series_doamdat.push({
          x: new Date(item.createdAt).getTime(),
          y: itemParsed.humid_soil,
        });
        listData.series_anhsang.push({
          x: new Date(item.createdAt).getTime(),
          y: itemParsed.lux,
        });
      }
      chart_data = listData;

      chart.updateSeries([
        {
          name: "Độ ẩm",
          data: listData.series_doam,
        },
        {
          name: "Nhiệt độ",
          data: listData.series_nhietdo,
        },
        {
          name: "Độ ẩm đất",
          data: listData.series_doamdat,
        },
        {
          name: "Ánh sáng",
          data: listData.series_anhsang,
        },
      ]);
    }
    function updateUILastMessage(lastDataParsed) {
      document.getElementById("giatri_doam").innerText =
        lastDataParsed.humid + "%";

      document.getElementById("giatri_nhietdo").innerText =
        lastDataParsed.temperature + " °C";
      document.getElementById("giatri_doamdat").innerText =
        lastDataParsed.humid_soil + "%";
      document.getElementById("giatri_anhsang").innerText =
        lastDataParsed.lux + " lux";
      document.getElementById("giatri_mua").innerText =
        lastDataParsed.mua == true ? "Đang mưa" : "Đang không mưa";
      document.getElementById("giatri_automode").innerText =
        lastDataParsed.auto_mode == true ? "Đang bật" : "Đang tắt";

      document.getElementById("giatri_bom").innerText =
        lastDataParsed.bom == true ? "Đang bật" : "Đang tắt";

      document.getElementById("giatri_quat").innerText =
        lastDataParsed.quat == true ? "Đang bật" : "Đang tắt";
      document.getElementById("giatri_den1").innerText =
        lastDataParsed.den1 == true ? "Đang bật" : "Đang tắt";
      document.getElementById("giatri_den2").innerText =
        lastDataParsed.den2 == true ? "Đang bật" : "Đang tắt";
    }
    window.setInterval(function () {
      fetch("/v1/devices/sensorData", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId: params["deviceId"] }),
      })
        .then((res) => res.json())
        .then((res) => {
          last_report = res[0].rawData;
          let lastDataParsed = parseReportMessage(last_report);
          console.log(lastDataParsed);
          updateUILastMessage(lastDataParsed);
          processListReportCmd(res);
        });
    }, 5000);
  }
  function publish(topic, message) {
    return fetch("/v1/devices/publish", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        message,
      }),
    });
  }
  function publishCommand(message) {
    let user = localStorage.getItem("user");

    if (typeof user === "undefined") {
      console.log("User not login");
      alert("Có lỗi xảy ra, chưa đăng nhập");
      return;
    }
    user = JSON.parse(user);
    let topic = `${user.email}/${params["deviceId"]}`;
    publish(topic, message)
      .then((res) => res.data)
      .then((res) => console.log(res));
  }

  document.getElementById("btn-turn-on-auto").addEventListener("click", () => {
    publishCommand("auto|1");
  });
  document.getElementById("btn-turn-off-auto").addEventListener("click", () => {
    publishCommand("auto|0");
  });
  document.getElementById("btn-turn-on-bom").addEventListener("click", () => {
    publishCommand("cmd_relay|7|0");
  });
  document.getElementById("btn-turn-off-bom").addEventListener("click", () => {
    publishCommand("cmd_relay|7|1");
  });

  document.getElementById("btn-turn-on-quat").addEventListener("click", () => {
    publishCommand("cmd_relay|8|0");
  });
  document.getElementById("btn-turn-off-quat").addEventListener("click", () => {
    publishCommand("cmd_relay|8|1");
  });

  document.getElementById("btn-turn-on-den1").addEventListener("click", () => {
    publishCommand("cmd_relay|9|0");
  });
  document.getElementById("btn-turn-off-den1").addEventListener("click", () => {
    publishCommand("cmd_relay|9|1");
  });

  document.getElementById("btn-turn-on-den2").addEventListener("click", () => {
    publishCommand("cmd_relay|6|0");
  });
  document.getElementById("btn-turn-off-den2").addEventListener("click", () => {
    publishCommand("cmd_relay|6|1");
  });

  document
    .getElementById("btn_limit_temperature")
    .addEventListener("click", () => {
      let val = document.getElementById("limit_temperature").value;
      publishCommand("cd_nhietdo|" + val);
    });

  document
    .getElementById("btn_limit_soil_humid")
    .addEventListener("click", () => {
      let val = document.getElementById("limit_soil_humid").value;
      publishCommand("cd_doamdat|" + val);
    });

  document.getElementById("btn_limit_light").addEventListener("click", () => {
    let val = document.getElementById("limit_light").value;
    publishCommand("cd_anhsang1|" + val);
  });
  document.getElementById("btn_limit_light_2").addEventListener("click", () => {
    let val = document.getElementById("limit_light_2").value;
    publishCommand("cd_anhsang1|" + val);
  });
});
