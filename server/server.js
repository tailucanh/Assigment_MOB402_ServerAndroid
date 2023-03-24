const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const path = require("path");
const expressHbs = require("express-handlebars");
const routerLogin = require("../routers/routerLogin");
const routerAdmin = require("../routers/routerAdmin");
const routerUsers = require("../routers/routerUsers");
const routerProducts = require("../routers/routerProducts");
var dir = "D:/Android/AndroidPoly/MOB402_Android_Server/Assigment";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static(dir));

app.engine(
  ".hbs",
  expressHbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts/",
  })
);
app.set("view engine", "hbs");
app.use("/", routerLogin);
app.use("/admin", routerAdmin);
app.use("/users", routerUsers);
app.use("/products", routerProducts);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
