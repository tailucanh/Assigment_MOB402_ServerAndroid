$(document).ready(function () {
  $("#sidebar, #content").toggleClass("active");

  $("#logoutModal").on("show.bs.modal", function (event) {
    $("#logout-link").attr("href", "/logout");
  });

  $("#logout-link").click(function (event) {
    $("#loading-overlay").show();
    setTimeout(() => {
      $("#loading-overlay").hide();
    }, 2000);
  });
});
