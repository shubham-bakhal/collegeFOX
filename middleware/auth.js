const jwt = require('jsonwebtoken');

exports.loginRequired = function (req, res, next) {
  try {

  console.log("LOgin require");
    // const token = JSON.parse(req.cookies.user).token || req.headers.authorization.split(' ')[1];
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded) {
        console.log("Decoded");
        return next();
      } else {
        console.log(err);
        return next({
          status: 401,
          message: 'Please login first'
        })
      }
    })
  } catch (error) {
 console.log(error);
    next({
      status: 401,
      message: error.message
    });
  }
}

exports.ensureCorrectUser = (req, res, next) => {
  try {
    console.log("Ensure");
    // const token = JSON.parse(req.cookies.user).token || req.headers.authorization.split(' ')[1];
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded && decoded.id === req.params.id) {
        return next();
      } else {
        return next({
          status: 401,
          message: 'Unauthorized'
        })
      }
    })
  } catch (error) {
    next({
      status: 401,
      message: 'Unauthorized'
    })
  }
}