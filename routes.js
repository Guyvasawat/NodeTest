const router = require("express").Router();
const { body } = require("express-validator");
const passport = require('passport');

const {
    resetpassword,
    homePage,
    register,
    registerPage,
    login,
    loginPage,
} = require("./controllers/userController");

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.userID){
        return res.redirect('/login');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.userID){
        return res.redirect('/');
    }
    next();
}

router.get('/', ifNotLoggedin, homePage);

router.get("/login", ifLoggedin, loginPage);
router.post("/login",
ifLoggedin,
    [
        body("_email", "Invalid email address")
            .notEmpty()
            .escape()
            .trim()
            .isEmail(),
        body("_password", "The Password must be of minimum 6 characters length")
            .notEmpty()
            .trim()
            .isLength({ min: 6 }),
    ],
    login
);

router.get("/signup", ifLoggedin, registerPage);
router.post(
    "/signup",
    ifLoggedin,
    [
        body("_name", "The name must be of minimum 3 characters length")
            .notEmpty()
            .escape()
            .trim()
            .isLength({ min: 3 }),
        body("_email", "Invalid email address")
            .notEmpty()
            .escape()
            .trim()
            .isEmail(),
        body("_password", "The Password must be of minimum 6 characters length")
            .notEmpty()
            .trim()
            .isLength({ min: 6 }),
    ],
    register
);






///////////////////
router.get('/', function (req, res) {
    res.render('login'); // load the index.ejs file
  });
  
  router.get('/home', isLoggedIn, function (req, res) {
    res.render('home', {
      user: req.user 
    });
  });
  
 /* router.get('/error', isLoggedIn, function (req, res) {
    res.render('pages/error.ejs');
  });
 */ 
  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  }));
  
  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/home',
      //failureRedirect: '/error'
    }));
  
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }
///////////////////

router.post('/resetpassword', resetpassword);


router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        next(err);
    });
    res.redirect('/login');
});

module.exports = router;