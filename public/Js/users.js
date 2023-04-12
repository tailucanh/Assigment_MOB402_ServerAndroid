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

  $("#modalAdd button.btn-primary").click(function () {
    $.ajax({
      type: "POST",
      url: "/",
      data: $("#add-user-form").serialize(),
      success: function () {
        location.reload();
      },
    });
  });

  $("#deleteModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var userId = button.data("id");
    var username = button.data("name");
    var modal = $(this);
    modal.find("#userName").text(username);

    var deleteLink = "/users/delete/" + userId;
    $("#delete-link").attr("href", deleteLink);
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

    $.ajax({
      type: "POST",
      url: "/users/update/" + userId,
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

    $("#editModal").modal("hide");
    event.stopPropagation();
  });
});
