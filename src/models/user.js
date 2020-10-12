const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const Task = require("./task");

const userSchema = new mongoose.Schema( {
    name : {
        type: String,
        required: true,
        trim: true, // removes extra spaces(before and after)
        lowercase: true 
    }, 
    email : {
        type: String, 
        unique: true,
        required: true, 
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value))
            {
                throw new Error("Email is invalid");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error("Age must be a positive no");
            }
        }
    }, 
    password: {
        type: String, 
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.includes("password"))
            {
                throw new Error("Password invalid");
            }
        }
    },
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

// we need this binding so we use normal function
// we use this keyword to get the user
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({id: user._id.toString()}, "perkbai");
    user.tokens.push({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject(); //removes all mongoose methods like save

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    
    if(!user) {
        throw new Error("Unable to login!!!"); //throw stops no need return
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error("Unable to login!!!");
    }

    return user;
}



//hash the plain text pass before saving middleware
userSchema.pre("save", async function(next) {
    //this refers to user being saved
    const user = this; //not actually required

    //only hash if hashed password
    //if password is modified return true
    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();// now you continue to next task
})

//Delete user tasks when user is removed

userSchema.pre("remove", async function(next) {
    const user = this;
    await Task.deleteMany({owner: user._id});

    next();
})


const User = mongoose.model("User", userSchema);

module.exports = User;

