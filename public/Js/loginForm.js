$(document).ready(function () {
  $("#togglePassword").click(function () {
    const type =
      $("#password").attr("type") === "password" ? "text" : "password";
    $("#password").attr("type", type);
    $("#togglePassword").toggleClass("fa-eye fa-eye-slash");
  });

  $("#toggleRePassword").click(function () {
    const type =
      $("#re_password").attr("type") === "password" ? "text" : "password";
    $("#re_password").attr("type", type);
    $("#toggleRePassword").toggleClass("fa-eye fa-eye-slash");
  });

  const alert = $("#my-alert");
  const errorMessage = $("#error-message");
  const closeAlert = $("#close-alert");

  closeAlert.on("click", () => {
    alert.addClass("d-none");
  });

  function isAlert(message) {
    errorMessage.text(message);
    alert.removeClass("d-none");
    setTimeout(() => {
      alert.addClass("d-none");
    }, 3000);
  }
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    validateForm();
  });

  function validateForm() {
    var email = $("input[name='email']").val();
    var password = $("input[name='password']").val();
    let inputEmail = $("#input-email");
    let icEmail = $("#ic-email");
    let inputPassword = $("#input-password");
    let icPassword = $("#ic-password");

    if (validateEmail(email)) {
      isAlert(validateEmail(email));
      inputEmail.css("border", "1px solid red");
      inputPassword.css("border", "1px solid red");
      icEmail.css("color", "red");
      icPassword.css("color", "red");
      return false;
    } else if (validatePassword(password)) {
      isAlert(validatePassword(password));
      inputEmail.css("border", "");
      inputPassword.css("border", "1px solid red");
      icEmail.css("color", "");
      icPassword.css("color", "red");
      return false;
    } else {
      inputEmail.css("border", "");
      inputPassword.css("border", "");
      icEmail.css("color", "");
      icPassword.css("color", "");
      var formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      $("#loading-overlay").show();
      $.ajax({
        url: "/login/submit_form",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response, status, xhr) {
          if (response.success) {
            window.location.href = response.redirectUrl;
            $("#loading-overlay").hide();
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#loading-overlay").hide();
          isAlert(jqXHR.responseJSON.message);
        },
      });
    }
  }

  const validateEmail = (email) => {
    if (!email) {
      return "Vui lòng nhập email.";
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Email không hợp lệ.";
    }
    return null;
  };
  const validatePassword = (password) => {
    if (!password) {
      return "Vui lòng nhập mật khẩu.";
    }
    return null;
  };
});
