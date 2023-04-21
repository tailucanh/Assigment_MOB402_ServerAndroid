$(document).ready(function () {
  $('label[for="upload-photo"]').on("click", function () {
    $("#img_product").click();
  });

  const imageInput = $("#img_product")[0];
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
    $("#img_edit_product").click();
  });
  const imageEditInput = $("#img_edit_product")[0];
  const imagEditPreview = $("#view_edit_image")[0];
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

  $("#addProductForm").submit(function (e) {
    e.preventDefault();
    var productImage = $("#img_product")[0].files[0];
    var productName = $("#name").val();
    var productPrice = $("#price").val();
    var productType = $("#type").val();
    var productDesc = $("#desc").val();

    var formData = new FormData();
    formData.append("name", productName);
    formData.append("img_product", productImage);
    formData.append("price", productPrice);
    formData.append("type", productType);
    formData.append("desc", productDesc);
    $("#loading-overlay").show();
    $.ajax({
      type: "POST",
      url: "/products/add_product",
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
    var productId = button.data("id");
    var productName = button.data("name");
    var modal = $(this);
    modal.find("#productName").text(productName);

    $("#delete-button").click(function (event) {
      event.preventDefault();
      $("#loading-overlay").show();
      $.ajax({
        url: "/products/delete_product/" + productId,
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
    var imageData = button.data("image");
    var price = button.data("price");
    var type = button.data("type");
    var desc = button.data("desc");

    var modal = $(this);
    desc
      ? modal.find("#info-title-desc").show()
      : modal.find("#info-title-desc").hide();

    imageData.toString().length > 13
      ? modal.find("#img-product").attr("src", imageData)
      : modal.find("#img-product").attr("src", "/images/logo_title.png");

    modal.find("#info-name").text(name);
    modal.find("#info-price").text(price);
    modal.find("#info-type").text(type);
    modal.find("#info-desc").text(desc);
  });

  $("#editModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var productId = button.data("id");
    var name = button.data("name");
    var price = button.data("price");
    var imageData = button.data("image");
    var type = button.data("type");
    var desc = button.data("desc");

    var modal = $(this);

    imageData.toString().length > 13
      ? modal.find("#view_edit_image").attr("src", imageData)
      : modal.find("#view_edit_image").attr("src", "/images/logo_title.png");
    modal.find("#editProductId").val(productId);
    modal.find("#edit-name").val(name);
    modal.find("#edit-price").val(price);
    modal.find("#edit-type").val(type);
    modal.find("#edit-desc").val(desc);
  });

  $("#editProductForm").submit(function (event) {
    event.preventDefault();
    var productId = $("#editProductId").val();
    var productImage = $("#img_edit_product")[0].files[0];
    var productName = $("#edit-name").val();
    var productPrice = $("#edit-price").val();
    var productType = $("#edit-type").val();
    var productDesc = $("#edit-desc").val();

    var formData = new FormData();
    formData.append("name", productName);
    formData.append("img_product", productImage);
    formData.append("price", productPrice);
    formData.append("type", productType);
    formData.append("desc", productDesc);
    $("#loading-overlay").show();
    $.ajax({
      type: "PUT",
      url: "/products/update_product/" + productId,
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

  $("#btn-search").on("click", function (event) {
    event.preventDefault();
    var keyword = $("#search_input").val();
    if (keyword === "") {
      isAlertError("Hãy nhập từ khóa trước khi tìm kiếm.");
    } else {
      $("#searchProductForm").submit();
    }
  });
  const currentUrl = window.location.href;
  if (currentUrl.indexOf("search") !== -1) {
    $("#sidebar, #content").toggleClass("active");
    $(".collapse.in").toggleClass("in");
    $("a[aria-expanded=true]").attr("aria-expanded", "true");
  }
});
