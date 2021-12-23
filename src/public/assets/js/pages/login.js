"use strict";
document.addEventListener("DOMContentLoaded", function (event) {
  let user = localStorage.getItem("user");
  if (typeof user === "undefined") {
    console.log("User not login");
  }
  console.log("List devices");

  var frm = $("#frmLogin");

  frm.submit(function (e) {
    e.preventDefault();
    let email = $("#email").val();
    let password = $("#password").val();
    fetch("v1/auth/login", {
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
        if (response.status === 401) {
          swal("Good job!", "Kiểm tra tên tài khoản hoặc mật khẩu", "error");
        }

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
