const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./config')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    name: 'session',
    secret: 'my_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000, // 1hr
    }
}));

////////////facebook////////////////
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
    cookie: {
        maxAge: 3600 * 1000, // 1hr
    }
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
  
  passport.use(new FacebookStrategy({
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL
    }, function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  ));

//////////////////////upload////////////////////////////////////

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, 'file-' + Date.now() + '.' +
        file.originalname.split('.')[file.originalname.split('.').length-1])}
})

const upload = multer({ storage: storage })

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/home',upload.single('fileupload'),(req,res) => {
    const files = req.file;
    //console.log(files.path);
   //const des = req.body.description;
    res.render('show',req.file)
})

/////////////////upload//////////////////

app.get('/resetpassword', (req, res) => {
  res.render('resetpassword')
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.use((err, req, res, next) => {
    // console.log(err);
    return res.send('Internal Server Error');
});

app.listen(3000, () => console.log('Server is runngin on port 3000'));