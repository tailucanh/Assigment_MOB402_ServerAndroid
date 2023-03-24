const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("users", { title: "Users", active: { users: true } });
});

router.get("/delete/:id", function (req, res) {
  var id = req.params.id;
  const myArray = res.locals.users;
  console.log(myArray);
  // const index = myArray.findIndex((element) => element.id == id);
  // if (index !== -1) {
  //   listB.splice(index, 1);
  // }
  // res.redirect("/users");
});

module.exports = router;
