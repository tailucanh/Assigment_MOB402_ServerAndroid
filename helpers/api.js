const dotenv = require("dotenv");
dotenv.config();
const API =
  "mongodb+srv://LucAnhTai:" +
  process.env.KEY_PASS_MONGO_BD +
  "@" +
  process.env.KEY_CONNECT_MONGO_BD +
  ".emalwiw.mongodb.net/" +
  process.env.KEY_DATABASE_MONGO_DB +
  "?retryWrites=true&w=majority";

const secret = process.env.SECRET_KEY;
const emailAminMain = process.env.KEY_EMAIL_ADMIN_MAIN;

module.exports = { API, secret, emailAminMain };
