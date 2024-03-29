const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signup = async function (req, res, next) {
  try {
  
    let user = await db.User.create(req.body);
    console.log(user);
    let { id, username,phone, profileImageUrl } = user;
    let token = jwt.sign({
      id,
      username,
      profileImageUrl
    }, process.env.SECRET_KEY)
    return res.status(200).json({
      id,
      username,
      phone,
      profileImageUrl,
      token,
      bookmarks: []
    })
  } catch (error) {
   
    if (error.code === 11000) {
      error.message = 'Sorry, that username is taken';
    }
    return next({
      status: 400,
      message: error.message
    });
  }
}

exports.login = async function (req, res, next) {
  try {
    let user = await db.User.findOne({ email: req.body.email })
    let { id, username,phone, profileImageUrl, bookmarks } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      let token = jwt.sign({
        id,
        username,
        profileImageUrl
      }, process.env.SECRET_KEY);
      return res.status(200).json({
        id,
        username,
        phone,
        profileImageUrl,
        token,
        bookmarks
      })
    } else {
      return next({
        status: 400,
        message: "invalid Email/Password"
      })
    }
  } catch (error) {

    next({
      status: 400,
      message: "invalid Email/Password"
    });
  }
}

exports.verifyingCookie = function (req, res) {
  let cookie = JSON.parse(req.cookies.user);
  const resendCookie = cookie.token

  jwt.verify(cookie.token, process.env.SECRET_KEY, async (err, decoded) => {
    try {
      if (decoded && decoded.id === cookie.id) {
        let user = await db.User.findOne({ _id: cookie.id });
        res.status(200).json({
          id: user._id,
          username: user.username,
          phone: user.phone,
          profileImageUrl: user.profileImageUrl,
          token: resendCookie,
          bookmarks: user.bookmarks
        })
      }
    } catch (err) {
    
      res.status(403).send("Unauthorised")
    }
  })
}