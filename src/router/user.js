const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account");

router.get("/users/me", auth , async (req, res) => {
    res.send(req.user);
})


router.post("/users", async (req,res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/users/login", async (req,res) => {
    // instead of getting the user compare and log in we use a middleware to do that
    try {
        //create own function
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(e) {
        res.status(400).send(e);
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token!=req.token
        });  
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
})

router.post("/users/logoutAll", auth, async(req, res) => {
    try {
        req.user.tokens = [];
        req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send(e);
    }
})

//suppose we send height which is not there in db we send err using custom code
router.patch("/users/me", auth , async(req,res) => {
    const updates = Object.keys(req.body); // return array of string of properties
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((item) => allowedUpdates.includes(item));

    //if every single update is found


    
    if(!isValidOperation)
        return res.status(400).send({error: "Invalid Updates!!"});
        // dont put in try and catch as it is for promise only!!
    try {
        //this doesnt use save middleware it bypasses it so we are gonna use my old approach
        //const user = await User.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}); // no need of set agr age doge to age hi update hoga
        const user = await req.user;

        //all updates 
        updates.forEach((update) => user[update]=req.body[update]);
        
        await user.save();
        
        if(!user)
            return res.status(404).send({});
        
        res.status(200).send(user);
    } catch(e) {
        //could be validator err or user galat type
        res.status(400).send(e);
    }
})

router.delete("/users/me", auth, async (req, res) => {
    // const id = req.params.id;
    try {
        // const user = await User.findByIdAndDelete(id);
        // if(!user)
        //     return res.status(404).send();
        sendCancelEmail(req.user.email, req.user.name);
        await req.user.remove();  
        res.status(200).send(req.user);
    } catch(e) {
        res.status(500).send(e);
    }
});

const errorMiddleware = function(err, req, res, next) {
    res.status(400).send({error: err.message});
}


const upload = multer({
    limits: {
        fileSize: 1*1024*1024
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|png|jpeg)/))
            cb(new Error("Upload a valid image"));
        cb(undefined, true);
    }
});

router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, function (err, req, res, next) {
    res.status(400).send({error: err.message});
});

router.delete("/users/me/avatar", auth, async(req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

//user can user this url in src field to get image printed
router.get("/users/:id/avatar", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar)
            throw new Error();
        
        // we need to set response header here
        // normally express automatically sets it to application/json
        res.set("Content-Type", "image/png");
        res.send(user.avatar);

    } catch(e) {
        res.status(404).send();
    }
})

module.exports = router;