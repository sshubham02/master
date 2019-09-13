const async = require('async');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('./configuration');

const dbcon = require('../dbcon');

signToken = id =>{
     return JWT.sign({
        iss:'waapi',
        sub:id,
        iat:new Date().getTime(),
        exp:new Date().setDate(new Date().getDate()+1)
    },JWT_SECRET)
}

module.exports = {
    signUp : async(req,res,next) => {
        let {email,password} = req.value.body;

        const emailExists = function(callback){
            let query = "SELECT 1 FROM `users` WHERE `email`=?";
            let values=[email];
            dbcon.query(query,values,function(err,result){
                if (err) {
                    console.log(err);
                    callback(null,{emailExist:-1});
                }
                let exists = 0;
                if(result!=null && result.length>0){
                    exists = 1;
                }
                callback(null,{emailExist:exists});
            })
        }

        const insertRecord=function(){
            let salt = bcrypt.genSaltSync(10);
            let passwordHash = bcrypt.hashSync(password, salt);
            let query = "INSERT INTO `users` (`email`, `password`) VALUES (?, ?)";
            let values = [email,passwordHash];
            dbcon.query(query,values,function(err,result){
                if (err) {
                    console.log(err);
                    throw err;
                }
                if(result.insertId!=null && result.insertId>0){
                    const token = signToken(result.insertId);
                    res.status(200).json({"code":200,token});
                }else{
                    res.status(200).json({code:0,status:'Something went wrong!'});
                    return;
                } 
            })
        }

        async.waterfall([emailExists],function(err,result){
            if(err){
                console.log(err);
                res.status(200).json({code:0,status:'Something went wrong!'});
                return;
            }

            var error = false;
            var errmsg = '';

            if(parseInt(result.emailExist)==-1){
                error=true;
                errmsg='Something went wrong!';
            }else if(parseInt(result.emailExist)==1){
                error=true;
                errmsg='Email already exists!';
            }

            if(error){
                res.status(200).json({code:0,status:errmsg});
                return;
            }

            insertRecord();

        })
    },
    signIn : async(req,res,next) => {
        const token = signToken(req.user.id);
        console.log('UsersController.signIn() called!');
        res.status(200).json({code:200,token});
    },
    secret : async(req,res,next) =>{
        console.log('UsersController.secret() called!');
        res.status(200).json({code:200,status:"resource"});
    }
}
