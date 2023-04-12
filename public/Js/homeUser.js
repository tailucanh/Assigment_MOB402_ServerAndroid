$(document).ready(function () {
  $("#sidebar, #content").toggleClass("active");

  $("#logoutModal").on("show.bs.modal", function (event) {
    $("#logout-link").attr("href", "/logout");
  });

  $('label[for="upload-edit-photo"]').on("click", function () {
    $("#edit_avatar").click();
  });
  const imageEditInput = $("#edit_avatar")[0];
  const imagEditPreview = $("#view_edit_avatar")[0];
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

  $("#editProfileForm").submit(function (event) {
    event.preventDefault();
    var userId = $("#userId").val();
    var userAvatar = $("#edit_avatar")[0].files[0];
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

    $.ajax({
      type: "POST",
      url: "/home/profile/" + userId,
      data: formData,
      processData: false,
      contentType: false,
      success: function (result) {
        location.reload();
      },
      error: function (err) {
        console.error(err);
      },
    });

    $("#profileModal").modal("hide");
  });
});
