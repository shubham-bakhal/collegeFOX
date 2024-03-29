const express = require('express');
const router = express.Router();
const { signup, login, verifyingCookie } = require('../handlers/auth');
const db = require('../models')

router.get('/verifying-cookie', verifyingCookie);

router.post('/signup', signup);

router.post('/signin', login);

router.get('/otherRegisterData', async (req, res,next) => {
  try {
    const users = await db.User.find();
    const data = { usernames: [], emails: [] };
    users.forEach((val) => {
      data.usernames.push(val.username);
      data.emails.push(val.email);
    })
    res.status(200).json(data);
  } catch (error) {
    next(error)
  }
})

module.exports = router;