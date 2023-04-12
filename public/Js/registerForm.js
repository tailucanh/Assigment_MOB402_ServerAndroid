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

  $("#registerForm").submit(function (event) {
    event.preventDefault();
    validateForm();
  });

  function validateForm() {
    let name = $("#name").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let re_password = $("#re_password").val();
    let inputName = $("#input-name");
    let icName = $("#ic-name");
    let inputEmail = $("#input-email");
    let icEmail = $("#ic-email");
    let inputPassword = $("#input-password");
    let icPassword = $("#ic-password");
    let inputRePassword = $("#input-re-password");
    let icRePassword = $("#ic-re-password");

    if (validateName(name)) {
      isAlert(validateName(name));
      inputName.css("border", "1px solid red");
      inputEmail.css("border", "1px solid red");
      inputPassword.css("border", "1px solid red");
      inputRePassword.css("border", "1px solid red");
      icName.css("color", "red");
      icEmail.css("color", "red");
      icPassword.css("color", "red");
      icRePassword.css("color", "red");
      return false;
    } else if (validateEmail(email)) {
      isAlert(validateEmail(email));
      inputName.css("border", "");
      inputEmail.css("border", "1px solid red");
      inputPassword.css("border", "1px solid red");
      inputRePassword.css("border", "1px solid red");
      icName.css("color", "");
      icEmail.css("color", "red");
      icPassword.css("color", "red");
      icRePassword.css("color", "red");
      return false;
    } else if (validatePassword(password)) {
      isAlert(validatePassword(password));
      inputName.css("border", "");
      inputEmail.css("border", "");
      inputPassword.css("border", "1px solid red");
      inputRePassword.css("border", "1px solid red");
      icName.css("color", "");
      icEmail.css("color", "");
      icPassword.css("color", "red");
      icRePassword.css("color", "red");

      return false;
    } else if (validateConfirmPassword(password, re_password)) {
      isAlert(validateConfirmPassword(password, re_password));
      inputName.css("border", "");
      inputEmail.css("border", "");
      inputPassword.css("border", "");
      inputRePassword.css("border", "1px solid red");
      icName.css("color", "");
      icEmail.css("color", "");
      icPassword.css("color", "");
      icRePassword.css("color", "red");
      return false;
    } else {
      inputName.css("border", "");
      inputEmail.css("border", "");
      inputPassword.css("border", "");
      inputRePassword.css("border", "");
      icName.css("color", "");
      icEmail.css("color", "");
      icPassword.css("color", "");
      icRePassword.css("color", "");
      var formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("re_password", re_password);

      $("#loading-overlay").show();
      $.ajax({
        url: "/register/register_form",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response, status, xhr) {
          if (response.success) {
            setTimeout(() => {
              window.location.href = response.redirectUrl;
              $("#loading-overlay").hide();
            }, 2000);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#loading-overlay").hide();
          isAlert(jqXHR.responseJSON.message);
        },
      });
    }
  }

  const validateName = (name) => {
    if (!name) {
      return "Vui lòng nhập tên của bạn.";
    }
    if (name.trim().length < 2) {
      return "Tên phải có ít nhất 2 ký tự.";
    }
    return null;
  };

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
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    return null;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return "Vui lòng nhập lại mật khẩu.";
    }
    if (password !== confirmPassword) {
      return "Mật khẩu nhập lại không khớp.";
    }
    return null;
  };
});
