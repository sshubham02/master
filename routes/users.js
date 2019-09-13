const express = require('express');
const router = require('express-promise-router')();
const passport = require("passport");
const passportConf = require("../passport");

const {validateBody,schemas} = require('../validator/routevalidate');
const UsersController = require('../utils/users');

router.route('/signup').post(validateBody(schemas.authschema),UsersController.signUp);

router.route('/signin').post(validateBody(schemas.authschema),passport.authenticate('local',{session:false}),UsersController.signIn);

router.route('/secret').get(passport.authenticate('jwt',{ session:false}),UsersController.secret);

module.exports = router;
