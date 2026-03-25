const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const allUsers = await User.find({});
  return res.json(allUsers);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({ msg: "Success" });
  } catch (err) {
    return res.status(400).json({
      msg: "Unsuccessful",
    });
  }
}

async function handleDeleteUserById(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ msg: "success" });
  } catch (err) {
    return res.json({
      msg: "unsuccess",
      error: err.message,
    });
  }
}

async function handleCreatingUser(req, res) {
  const { firstName, lastName, email, gender, jobTitle } = req.body;
  if (!req.body || !firstName || !jobTitle || !email) {
    return res.status(400).json({
      message:
        "firstName, email, jobTitle are required fields, may be you missed one of those",
    });
  }

  const result = await User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    jobTitle: jobTitle,
    gender: gender,
  });

  return res.status(201).json({
    message: "Success",
    result: result,
  });
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreatingUser
};
