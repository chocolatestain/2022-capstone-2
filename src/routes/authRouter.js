const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.post('/login', authController.login);
router.post('/sign-up', authController.signUp);
router.post('/leave', jwtMiddleware.verifyToken, authController.leave);

// //accessToken 발급 테스트 용
// const passport = require('passport');
// const KakaoStrategy = require('passport-kakao').Strategy;

// passport.use('kakao', new KakaoStrategy({
//         clientID: process.env.KAKAO_ID,
//         callbackURL: '/auth/kakao/callback',
//     }, async (accessToken, refreshToken, profile, done) => {
//         let user = {
//             profile: profile._json,
//             accessToken: accessToken
//         }
//         console.log(user.accessToken);
//         done(null, user)
//     }))

// router.get('/kakao', passport.authenticate('kakao'));
// router.get('/kakao/callback', passport.authenticate('kakao', {failureRedirect: '/',}), (req, res) => {res.redirect('/')});
// passport.serializeUser((user, done) => {done(null, user);});
// passport.deserializeUser((user, done) => {done(null, user);});

module.exports = router;