const { getUser } = require("../services/auth");

function checkForAuthentication(req, res, next) {
  // const authorizationHeaderValue = req.headers["authorization"];

  const tokenCookie = req.cookies?.token;
  req.user = null;

  // if (
  //   !authorizationHeaderValue ||
  //   !authorizationHeaderValue.startsWith("Bearer")
  // ) {
  //   req.user = null;
  //   return next();
  // }

  if (!tokenCookie) return next();

  const token = tokenCookie;

  // const token = authorizationHeaderValue.split("Bearer ")[1];

  const user = getUser(token);
  req.user = user;
  return next();
}

function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) {
      return res.redirect("/login");
    }
    console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      return res.end("UnAuthorized");
    }

    return next();
  };
}

//Below 2 functions doing the same thing, so its a repetitive code

// async function restrictToLoggedInUserOnly(req, res, next) {
//   //==========================================================
//   //Use this in the case of cookies
//   // const userUid = req.cookies?.uid;
//   //==========================================================

//   //==========================================================
//   //Use this in the case of bearer authorization
//   const userUid = req.headers["authorization"];
//   //==========================================================

//   if (!userUid) return res.redirect("/login");

//   //==========================================================
//   //Use this in the case of bearer authorization
//   const token = userUid.split("Bearer ")[1];
//   //==========================================================

//   //==========================================================
//   //Use this in the case of cookies
//   // const user = getUser(userUid);
//   //==========================================================

//   //==========================================================
//   //Use this in the case of bearer authorization
//   const user = getUser(token);
//   //==========================================================

//   if (!user) return res.redirect("/login");

//   req.user = user;
//   next();
// }

// async function checkAuth(req, res, next) {
//   //==========================================================
//   //Use this in the case of cookies
//   // const userUid = req.cookies?.uid;
//   //==========================================================

//   //==========================================================
//   //Use this in the case of bearer authorization
//   console.log(req.headers);
//   const userUid = req.headers["authorization"];
//   const token = userUid.split("Bearer ")[1];
//   console.log(token);
//   //==========================================================

//   //==========================================================
//   //Use this in the case of cookies
//   // const user = getUser(userUid);
//   //==========================================================

//   //==========================================================
//   //Use this in the case of bearer authorization
//   const user = getUser(token);
//   //==========================================================

//   req.user = user;
//   next();
// }

module.exports = {
  // restrictToLoggedInUserOnly,
  // checkAuth,
  restrictTo,
  checkForAuthentication,
};
