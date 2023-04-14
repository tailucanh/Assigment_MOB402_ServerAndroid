$(document).ready(function () {
  $('label[for="upload-photo"]').on("click", function () {
    $("#avatar").click();
  });

  const imageInput = $("#avatar")[0];
  const imagePreview = $("#view_image")[0];
  $(imageInput).on("change", function () {
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      imagePreview.src = reader.result;
    });

    if (file) {
      reader.readAsDataURL(file);
    }
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
  var tdValue = $("#td-email").text();

  if (tdValue == "admin@gmail.com") {
    $("#btn-edit").hide();
    $("#btn-delete").hide();
  } else {
    $("#btn-edit").show();
    $("#btn-delete").show();
  }

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

  $("#add-user-form").submit(function (event) {
    event.preventDefault();
    var name = $("input[name='name']").val();
    var avatar = $("#avatar")[0].files[0];
    var email = $("input[name='email']").val();
    var password = $("input[name='password']").val();
    var permission = $("#select-permission").val();

    var formData = new FormData();
    formData.append("name", name);
    formData.append("avatar", avatar);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("permission", permission);

    $("#loading-overlay").show();
    $.ajax({
      url: "/users/add_user",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response, status, xhr) {
        if (response.success) {
          $("#loading-overlay").hide();
          isAlertSuccess(response.message);
          location.reload();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#loading-overlay").hide();
        isAlertError(jqXHR.responseJSON.message);
      },
    });
  });

  $("#deleteModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var userId = button.data("id");
    var username = button.data("name");
    var modal = $(this);
    modal.find("#userName").text(username);

    $("#delete-button").click(function (event) {
      event.preventDefault();
      $("#loading-overlay").show();
      $.ajax({
        url: "/users/delete_user/" + userId,
        type: "DELETE",
        processData: false,
        contentType: false,
        success: function (response, status, xhr) {
          if (response.success) {
            $("#loading-overlay").hide();
            isAlertSuccess(response.message);
            location.reload();
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#loading-overlay").hide();
          isAlertError(jqXHR.responseJSON.message);
        },
      });
    });
  });

  $("#infoModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var name = button.data("name");
    var imageData = button.data("avatar");
    var email = button.data("email");
    var permission = button.data("permission");

    var modal = $(this);

    imageData.toString().length > 13
      ? modal.find("#img-avatar").attr("src", imageData)
      : modal.find("#img-avatar").attr("src", "/images/ic_avatar.png");

    modal.find("#info-name").text(name);
    modal.find("#info-email").text(email);
    if (permission) {
      modal.find("#info-permission").text("Quản trị viên");
      modal.find("#info-permission").css({ color: "red" });
    } else {
      modal.find("#info-permission").text("Người dùng");
      modal.find("#info-permission").css({ color: "blue" });
    }
  });

  $("#editModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var userId = button.data("id");
    var name = button.data("name");
    var email = button.data("email");
    var permission = button.data("permission");
    var imageData = button.data("avatar");

    var modal = $(this);
    imageData.toString().length > 13
      ? modal.find("#view_edit_avatar").attr("src", imageData)
      : modal.find("#view_edit_avatar").attr("src", "/images/ic_avatar.png");

    modal.find("#editUserId").val(userId);
    modal.find("#edit-name").val(name);
    modal.find("#edit-email").val(email);

    if (permission) {
      $("#select-edit-permission").val("admin");
    } else {
      $("#select-edit-permission").val("user");
    }
  });

  $("#editUserForm").submit(function (event) {
    event.preventDefault();
    var userId = $("#editUserId").val();
    var userAvatar = $("#edit_avatar")[0].files[0];
    var userName = $("#edit-name").val();
    var userEmail = $("#edit-email").val();
    var userPermission = $("#select-edit-permission").val();

    var formData = new FormData();
    formData.append("name", userName);
    formData.append("avatar", userAvatar);
    formData.append("email", userEmail);
    formData.append("selectedValue", userPermission);

    $("#loading-overlay").show();
    $.ajax({
      type: "PUT",
      url: "/users/update_user/" + userId,
      data: formData,
      processData: false,
      contentType: false,
      success: function (response, status, xhr) {
        if (response.success) {
          $("#loading-overlay").hide();
          isAlertSuccess(response.message);
          location.reload();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#loading-overlay").hide();
        isAlertError(jqXHR.responseJSON.message);
      },
    });
  });
});
