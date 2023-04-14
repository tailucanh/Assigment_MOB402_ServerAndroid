$(document).ready(function () {
  $('label[for="upload-profile-avatar"]').on("click", function () {
    $("#edit_profile_avatar").click();
  });

  const imageEditInput = $("#edit_profile_avatar")[0];
  const imagEditPreview = $("#view_profile_avatar")[0];
  $(imageEditInput).on("change", function () {
    const file = imageEditInput.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      imagEditPreview.src = reader.result;
    });

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  const alertError = $("#my-alert-error");
  const errorMessage = $("#error-message");
  const closeAlertError = $("#close-alert-error");

  closeAlertError.on("click", () => {
    alertError.addClass("d-none");
  });

  const alertSuccess = $("#my-alert-success");
  const successMessage = $("#success-message");
  const closeAlertSuccess = $("#close-alert-success");

  closeAlertSuccess.on("click", () => {
    alertSuccess.addClass("d-none");
  });

  function isAlertError(message) {
    errorMessage.text(message);
    alertError.removeClass("d-none");
    setTimeout(() => {
      alertError.addClass("d-none");
    }, 3000);
  }

  function isAlertSuccess(message) {
    successMessage.text(message);
    alertSuccess.removeClass("d-none");
    setTimeout(() => {
      alertSuccess.addClass("d-none");
    }, 3000);
  }

  $("#editProfileForm").submit(function (event) {
    event.preventDefault();
    var userId = $("#userId").val();
    var userAvatar = $("#edit_profile_avatar")[0].files[0];
    var userName = $("#edit-name").val();
    var userEmail = $("#edit-email").val();
    var valueOldPass = $("#edit-old-password").val();
    var valueNewPass = $("#edit-new-password").val();

    var formData = new FormData();
    formData.append("name", userName);
    formData.append("avatar", userAvatar);
    formData.append("email", userEmail);

    formData.append("valueOldPassword", valueOldPass);
    formData.append("valueNewPassword", valueNewPass);

    $("#loading-overlay").show();
    $.ajax({
      type: "PUT",
      url: "/profile/" + userId,
      data: formData,
      processData: false,
      contentType: false,
      success: function (response, status, xhr) {
        if (response.success) {
          setTimeout(() => {
            $("#loading-overlay").hide();
            isAlertSuccess(response.message);
            location.reload();
          }, 2000);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#loading-overlay").hide();
        isAlertError(jqXHR.responseJSON.message);
        location.reload();
      },
    });
  });
});
