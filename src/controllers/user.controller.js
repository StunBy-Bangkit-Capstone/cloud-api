const userService = require('../services/user.service.js')
const validation = require('../validations/user.validation.js')
const {validate} = require('../utils/validation.js')

async function register (req, res,next) {
    try {
        const validated = validate(validation.registerSchema, req.body); 
        const result = await userService.registerUser(validated);

        res.status(201).json({
            res_regis : {
                message : 'Created account succes',
                data_regis : result
            }
        })

    } catch (error) {
        next(error)
    }
}


async function login(req,res,next) {
    try {
        
        const validated = validate(validation.loginSchema, req.body); 
        const result = await userService.loginUser(validated)

        res.status(200).json({
            res_login : {
                message : 'Login Success',
                dataLogin: result
            }
        })

    } catch (error) {
        next(error)
    }
    
}

module.exports = {register,login}