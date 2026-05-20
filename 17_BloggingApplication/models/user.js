const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const {createTokenForUser} = require('../services/auth')

const userSchema = new Schema(
  { 
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/defaultUserAvatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = randomBytes(16).toString("hex");

  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
});

userSchema.static('matchPasswordAnfGenerateToken', async function(email, password){
    // console.log(email, password)

    const user = await this.findOne({email})

    if(!user){
        throw new Error('User not found')
        return
    } 

    const salt = user.salt

    // console.log(salt)

    const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    // console.log(hashedPassword, user.password )

    if(hashedPassword !== user.password){
        throw new Error('Password not matched')
        return
    }

    const token = createTokenForUser(user)

    return token
})

const USER = model("user", userSchema);

module.exports = USER;

