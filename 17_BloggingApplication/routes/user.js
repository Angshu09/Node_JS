const { Router } = require("express");
const USER = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await USER.matchPasswordAnfGenerateToken(email, password);

    // console.log(token)

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    // console.log(error)
    return res.render("signin", { error: "incorrect email or password" });
  }
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
//   console.log(fullName, email, password);
  await USER.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

router.get('/logout', (req, res) => {
    return res.clearCookie('token').redirect('/')
})

module.exports = router;
