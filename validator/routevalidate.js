const validator = require('joi');

module.exports = {
    validateBody:(schema) => {
        return (req,res,next) =>{
            const result = validator.validate(req.body, schema);
            if(result.error){
                return res.status(400).json({"code":200,"status":result.error.details[0].message});
            }

            if(!req.value){
                req.value={};
            }
            req.value['body'] = result.value;
            next();
        }
    },
    schemas : {
        authschema: validator.object().keys({
            email: validator.string().email().required(),
            password : validator.string().required()
        })
    }

}
