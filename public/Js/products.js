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
    $.ajax({
      type: "POST",
      url: "/products/add_item",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          alert(response.message);
          $("#modalAdd").modal("hide");
          location.reload();
        } else {
          alert(response.message);
        }
      },
    });
  });

  $("#deleteModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var productId = button.data("id");
    var productName = button.data("name");
    var modal = $(this);
    modal.find("#productName").text(productName);

    var deleteLink = "/products/delete/" + productId;
    $("#delete-link").attr("href", deleteLink);
  });

  $("#infoModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var name = button.data("name");
    var imageData = button.data("image");
    var price = button.data("price");
    var type = button.data("type");
    var desc = button.data("desc");
    console.log(imageData);
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

    $.ajax({
      type: "POST",
      url: "/products/update/" + productId,
      data: formData,
      processData: false,
      contentType: false,
      success: function () {
        $("#editModal").modal("hide");
      },
      error: function (err) {
        console.error(err);
      },
    });
  });
});
