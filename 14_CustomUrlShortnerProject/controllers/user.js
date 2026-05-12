
const {v4: uuidv4} = require('uuid')
const {setUser, getUser} = require('../services/auth')
const USER = require("../models/user");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;
  await USER.create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await USER.findOne({
    email,
    password,
  });
  console.log(user)
  if (!user) {
    return res.render("login", {
      error: "Invalid username or password",
    });
  }

  //=======================================================
  //we need sessionId in the case of state full auth
  // const sessionId = uuidv4()
  // setUser(sessionId, user)
  //=======================================================

  //This is stateless auth
  const token = setUser(user)

  //==========================================================
  //we need session Id in the case of state full auth
  // res.cookie('uid', sessionId)
  //==========================================================

  //==========================================================
  //using cookie concept here
  res.cookie('token', token)
  return res.redirect("/");
  //==========================================================


  //==========================================================
  //using bearer authorization concept here, sending token as a json response
  // return res.json({token})
}

module.exports = {
  handleUserSignUp,
  handleUserLogin
};
