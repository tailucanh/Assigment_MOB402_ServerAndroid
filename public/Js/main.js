$(document).ready(function () {
  $("#sidebar").mCustomScrollbar({
    theme: "minimal",
  });
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar, #content").toggleClass("active");
    $(".collapse.in").toggleClass("in");
    $("a[aria-expanded=true]").attr("aria-expanded", "false");

    if ($("#sidebar, #content").hasClass("active")) {
      $(this).css("margin-left", "0px");
      $(this).css("transition", "margin-left 0.5s ease");
    } else {
      $(this).css("margin-left", "195px");
      $(this).css("transition", "margin-left 0.5s ease");
    }
  });

  $(".list-unstyled.components li").click(function (e) {
    $(".list-unstyled.components li").removeClass("active");
    $(this).addClass("active");
  });

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
