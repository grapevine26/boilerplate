const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { User } = require('./models/User');
const config = require('./config/key')
const { auth } = require('./middleware/auth')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

app.use(cookieParser());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...')).catch(err => console.log(err))

// 루트
app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요aaa')
})

app.get('/api/hello', (req, res) => {
  res.send('안녕')
})

// 회원가입
app.post('/api/users/register', (req, res) => {
  //회원가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

// 로그인
app.post('/api/users/login', (req, res) => {
  // 이메일 확인. (몽고db에서 지원하는 메소드 findOne)
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일을 확인해주세요."
      })
    }

    // 비밀번호 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
      
      // 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // 토큰을 저장한다. 쿠키 or 로컬 or 세션
        res.cookie('x_auth', user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id})
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  // authentication true
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id}, { token: '' }, (err, user) => {
    if(err) return res.json({ success: false, err});
    return res.status(200).send({
      success: true
    })
  })
})
const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})