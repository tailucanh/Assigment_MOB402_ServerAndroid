const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
var flash = require("express-flash");
const session = require("express-session");
const { secret } = require("./helpers/api");
var mongoose = require("mongoose");
const { API } = require("./helpers/api");
const routerWelcome = require("./routers/routerWelcome");
const routerLogin = require("./routers/routerLogin");
const routerRegister = require("./routers/routerRegister");
const routerHome = require("./routers/routerHome");
const routerHomeUser = require("./routers/routerHomeUser");
const routerUsers = require("./routers/routerUsers");
const routerProducts = require("./routers/routerProducts");
const routerProfile = require("./routers/routerProfile");
const routerLogout = require("./routers/routerLogout");
const routerApi = require("./routers/routerApi");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine(
  ".hbs",
  expressHbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts/",
  })
);
app.set("view engine", "hbs");

mongoose.connect(API, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/", routerWelcome);
app.use("/login", routerLogin);
app.use("/register", routerRegister);
app.use("/home", routerHome);
app.use("/homeUser", routerHomeUser);
app.use("/users", routerUsers);
app.use("/products", routerProducts);
app.use("/profile", routerProfile);
app.use("/logout", routerLogout);
app.use("/api", routerApi);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
