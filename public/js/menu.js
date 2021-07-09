$(function () {
  var bar = "";
  bar += '<nav class="navbar navbar-default" role="navigation">';
  bar += '<div class="container-fluid">';
  bar += "<div>";
  bar += '<ul class="nav navbar-nav">';
  bar += '<li id="pan"><a href="../pan.html">PAN Card Verification</a></li>';
  bar +=
    '<li id="bank"><a href="../bank.html">Bank Account Verification</a></li>';
  bar +=
    '<li id="aadhaar"><a href="../aadhaar.html">Aadhaar Verification</a></li>';
  bar += "</ul>";
  bar += "</div>";
  bar += "</div>";
  bar += "</nav>";

  $("#main-bar").html(bar);

  var id = getValueByName("id");
  $("#" + id).addClass("active");
});

function getValueByName(name) {
  var url = document.getElementById("nav-bar").getAttribute("src");
  var param = new Array();
  if (url.indexOf("?") != -1) {
    var source = url.split("?")[1];
    items = source.split("&");
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var parameters = item.split("=");
      if (parameters[0] == "id") {
        return parameters[1];
      }
    }
  }
}
