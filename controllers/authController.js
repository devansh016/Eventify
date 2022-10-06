const User = require('./../models/userModel')
const jwt =require('jsonwebtoken')
const AppError = require('./../utils/appError')
const {promisify} = require('util')
const crypto = require('crypto')


const signToken = (id)=>{
    return jwt.sign({id: id} , process.env.JWT_SECRET ,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })

}
const sendToken = (user, statusCode , res)=>{
    const token = signToken(user._id)
    
    var cookieOption = {
        httpOnly: true,
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
    }
    if(process.env.NODE_ENV == 'production'){
        cookieOption.secure = true
    }
    user.password = undefined
    res.cookie('jwt' , token , cookieOption)
    res.status(statusCode).json({
        status: 'success',
        
        msg:{
            user
        }
        
    })
}
exports.signup = async (req, res , next)=>{
    try{
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role
        })
        
        sendToken(user , 200 , res)
        
    }catch( err){
        
        next( new AppError(err , 400))
    }
}

exports.login = async (req, res, next)=>{
    try{
        //check if email and pwd exist, validating the user input
        const {email,password} = req.body
        if( !email || !password){
            //here we return becuz it will cause a 
            //immidiate exit to this function
            //if that would not, leads to an multiple header set
            //error
            return next(new AppError('please provide pwd and email' , 400))
        }
        //check for email and match with the pwd
        const user = await User.findOne({
            email: email
        }).select('+password')//by default we exclude the pwd field from
                             // our resultset, but if we want to add it
                             //explicitly then we have to add 
                             //select('+password') 

        // console.log(user)
       //use of instance method , which are available to the every document object
       //
        if(!user || !( await user.correctPassword(password , user.password))){
            return next(new AppError('Incorrect email or pwd' , 401))
        }
        //if everything work better, create token and send it
        sendToken(user , 200 , res)
    }catch(err){
        next( new AppError(err , 400))
    }
}

//incase of logout we send a dummy token named 'loggedout' instead of a valid one
exports.logout = ( req, res)=>{
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 1000* 10),
        httpOnly: true
    })
    res.status(200).json({
        status: 'success'
    })
}

exports.protect = async (req, res, next)=>{
    //get the token and check if it is exist
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    else if( req.cookies.jwt){
        token  =  req.cookies.jwt ;
    }

    if(!token || token === 'loggedout'){
        return next(new AppError('you are not logged in. Please log in to access this page', 401))
    }
    //validate the token // verify the signautre
    //below promise return the decoded payload as resolved value
    try{
        var decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET)
        
        // console.log(decoded.id) 
    }catch( err){
        // console.log(err.name)
        next( err)
    }
    
    //check the user still exist
    //maybe i logged in now and i have a valid token, valid for let
    //say 90d but in the mean time, after 2days i delete my accunt 
    //and if someone else have my token that lead to the fault and can
    // access behalf of me
    // console.log(decoded.id) 
    const freshUser = await User.findById(decoded.id)
    if(!freshUser){
        return next( new AppError('the user belong to the user does not exist', 404))
    }
    
    //check if user changed pwd after the token issued
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next( new AppError('user change pwd, please login again', 401))
    }

    req.user = freshUser
    res.locals.user = freshUser
    //grant access to protected data
    next()
}


exports.forgetPassword = async (req , res ,next)=>{
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return next( new AppError('there is no email like that' , 404))
    }
    //each time user request for the pwd forget,
    // we will provide them a resetToken which is in turn is a
    // token to reset pwd,
    // we thrrefore encrypt it and save it on the user documents
    //such that we can match the one that is coming from user and
    // the encrypt one that is store on the documents
    const resetToken = user.createPasswordResetToken() // --> we did it on  the fat model bcuz this is someting related to the documents
    //above function call only modify the doc on the buffer,
    //but to save it on DB we have to call save() method
    await user.save({ validateBeforeSave: false }) // this option deable
    // all the validator on the schema
    const resetURL = req.protocol + '://'+req.get('host')+'/api/user/resetPassword/'+resetToken
    
    try{
        

        res.status(200).json({
            status:'success',
            msg:'Please do a POST req on below link and Mentaion your password and passwordConfirm on the request body'+" "+resetURL
        })
    }catch( err){
        user.passwordResetToken = undefined
        user.passwordResetExipres = undefined
        await user.save({ validateBeforeSave: false })
        return next(err)
    }
}
exports.resetPassword = async (req , res , next) =>{

    try{
        //get the user based on the token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExipres:{
                $gte:Date.now()
            }
        })

        
        
        //if token is not expired and user exist set the pwd
        if(!user){
            return next( new AppError('token is invalid or expired',400))
        }
        
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        //update the changedPasswordAt 
        // user.passwordChangedAt = Date.now() --> now at fat model
        user.passwordResetToken = undefined
        user.passwordResetExipres = undefined
        await user.save() //no validaiton off
        //actually the DB commit is bit slow than the jwt ist
        //therefore pwdCHangedAt would be later than jwt ist
        //and user never able to log in
        //therefore we subtract 1s from the pwdCHangedAt 

        //log the user send the JWT
        sendToken(user , 200 , res)
        
            

    }catch( err){
        return next(err);
    }
    
}

exports.updatePassword = async (req , res , next)=>{
    try{
        
        //user req to pass pwd even if you are already logged in
        // get user from collection
        const user = await User.findById(req.user._id).select('+password')
        
        //check for thr pwd correct
        // console.log(req.body.currentPassword)
        if(! (await user.correctPassword(req.body.currentPassword , user.password) )){
            return next( new AppError('Current password id wrong', 401))
        }
        //update the pwd
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        await user.save()

        //send the token
        sendToken(user , 200 , res)

    }catch( err){
        next(err)
    }
    
}
