const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const {JWT_SECRET} = require('./utils/configuration');
const dbcon = require('./dbcon');

passport.use(new JwtStrategy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey:JWT_SECRET
},async (payload,done) =>{ 
    try{
        let query = "SELECT * FROM `users` WHERE `id`=?";
        let values = [payload.sub];
        dbcon.query(query,values,function(err,result){
            if (err) {
                console.log(err);
                throw err;
            }
            if(result!=null && result.length>0){
                return done(null,result[0]);
            }else{
                return done(null,false);
            }
        })
    }catch(e){
        done(e,false);
    }

}))

passport.use(new LocalStrategy({
    usernameField : 'email'
}, async (email,password,done) => {
    try{
        let query = "SELECT * FROM `users` WHERE `email`=?";
        let values = [email];
        dbcon.query(query,values,function(err,result){
            if (err) {
                console.log(err);
                throw err;
            }
            if(result!=null && result.length>0){
                const isMatch = bcrypt.compareSync(password,result[0].password);
                if(!isMatch){
                    return done(null,false);
                }
                done(null,result[0]);
            }else{
                return done(null,false);
            }
        })
    }catch(e){
        done(e,false);
    }
}))