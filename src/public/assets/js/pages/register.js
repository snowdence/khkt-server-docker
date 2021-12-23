"use strict";
document.addEventListener("DOMContentLoaded", function (event) {
  let user = localStorage.getItem("user");
  if (typeof user === "undefined") {
    console.log("User not login");
  }
  console.log("List devices");

  var frm = $("#frmRegister");

  frm.submit(function (e) {
    e.preventDefault();
    let email = $("#email").val();
    let password = $("#password").val();
    fetch("v1/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(function (response) {
        if (response.status !== 200) {
          swal("Lỗi", "Tài khoản đã bị trùng hoặc có lỗi xảy ra", "error");
          throw "Kiểm tra tài khoản";
        }
        console.log(response.data);

        return response;
      })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("accessToken", res.token.accessToken);
        window.location.replace("/dashboard");
      })
      .catch(function (error) {});
  });
});
