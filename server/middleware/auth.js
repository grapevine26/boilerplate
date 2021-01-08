const { User } = require('../models/User')

let auth = (req, res, next) => {
  // 인증 처리
  // 쿠키에서 토큰 가져오기
  let token = req.cookies.x_auth;
  // 토큰 복호화 및 유저 가져오기
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({ isAuth: false, error: true})

    req.token = token;
    req.user = user;
    next();
  })

  // 유저
}

module.exports = { auth }; 