const express = require('express')
const AppError = require('../utils/appError.js')
const userRouter = express.Router()
const authController = require('./../controllers/authController.js')
const User = require('./../models/userModel')

//configure multer

//below router is against the RESTAPI format
userRouter.post('/signup' , authController.signup)
userRouter.post('/login' , authController.login)
userRouter.get('/logout' , authController.logout)

userRouter.route('/forgetPassword').post( authController.forgetPassword)
userRouter.route('/resetPassword/:token').patch( authController.resetPassword)


//in case of password whether it is creating one or a updating, or reseeting it
//must go through the save()/create() becuz then only our all pre save middlewarw
// will execute and encrypt our pwd and also run validator on confirmPwd

userRouter.route('/updatePassword').patch(authController.protect, authController.updatePassword)

// a GET request to the /api/me will send all the user data
userRouter.get('/me' ,authController.protect,async  (req, res, next)=> {
    const id = req.user._id
    const user = await User.findOne( {_id : id})
    if( !user){
        res.status(404).json( {
            status: "fail",
            msg: "Can not get the user with that id. Please check the id once again."

        })
    }
    res.status(200).json({
        status: "success",
        user
    })
});

userRouter.get('/', authController.protect, async (req, res, next)=>{
    try{
        var users = await User.find()
    }catch(err){
        console.log( err)
        return next( err)
    }
    
    if(!users){
        return next( new AppError('No user till now', 200))
    }
    res.status(200).json({
        status:'success',
        users
    })
})
module.exports = userRouter