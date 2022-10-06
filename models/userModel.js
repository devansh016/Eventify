const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchemaObject = {
    name:{
        type: String,
        required: [true , 'A user must have an user name'],
        maxLength: 50,
        minLength: 3,
        trim: true
    },
    email:{
        type: String,
        required: [true , 'A user must have an user email'],
        minLength: 5,
        trim: true,
        unique: true,
        lowercase: true,
        validate : [validator.isEmail , 'please provide a valid email']
    },
    photo:{
        type:String,
        default: 'default.jpg'
        //default field for the new users having no dp
        
    },
    password:{
        type : String , 
        required: [true , 'A user must have an user pwd'],
        minLength: 8,
        select: false // this schema type option will not select password 
                      //field when we are quering anything
    },
    passwordConfirm :{
        type : String , 
        required: [true , 'A user must have an user pwd'],
        minLength: 8,
        validate:{
            //this only work on save / create
            validator: function(el){
                return el === this.password
            },
            message: "pwd are not same"
        }
        
    },
    passwordChangedAt: Date,
    role:{
        type: String,
        enum: ['user' , 'guide' , 'lead-guide' , 'admin'],
        default: 'user'
    },
    passwordResetToken: String,
    passwordResetExipres: Date,
    active:{
        type: Boolean,
        default: true,
        select: false
    }
}

const userSchema =  new mongoose.Schema(userSchemaObject)

// we are gona use save for update aswel
//save pre hook middleware run before the document get save/ updated
//all the pre/post hook are defind on the schema itself

//below pre-save-hook will hash the pwd before save
userSchema.pre('save' , async function(next){
    //check whether the doc.pwd is modified
    if(!this.isModified('password'))
        return next()
    //encrypt the pwd at 12 cost
    try{
        this.password = await bcrypt.hash(this.password, 12)
        this.passwordConfirm = undefined// to remove from doc before commiting
        next()
    }
    catch(err){
        res.status(500).json({
            status: 'fail',
            err
        })
    }
    
})

//below save pre-hook will be called whenever we save/update any documents
//it will set the passwordChangedAt field whenever their is an update/save
//of password
userSchema.pre('save' , function(next){
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000
    next()
})

//instance method available for the all the document of certain collection

//below instance method for checking pwd correctness
userSchema.methods.correctPassword = async function(candidatePassword , userPassword){
    return await bcrypt.compare(candidatePassword , userPassword)
}

//below instance method called to validate if the user changed its pwd
//after the issueing date of JWT token
//if it has, then the current token is invalid
//and user have to create another new token
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10)
        // console.log(changedTimestamp, JWTTimestamp)
        return JWTTimestamp < changedTimestamp
    }
    return false;
}

//below instance method is use when a user hit the /api/forgotPassword
//it will create a random token, hash it and saves the hash value into the 
//passwordResetToken token, and return the token to the client.
//whenever the client request for /api/resetPassword with that above token
//client given token's hash value get compare with the saved hash value on
//passwordResetToken  field
//this way we flows the passwordForget and passwordReset
userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExipres = Date.now() + 10*60*1000
    return resetToken
}

//below find prehook is for filtering out all the user whose active 
//status is set false --> deactivated users
userSchema.pre(/^find/ , function(next){
    //only work on query
    this.find({ active: {
        $ne: false
    }})
    next()
})

const User = mongoose.model('User' , userSchema)

module.exports = User