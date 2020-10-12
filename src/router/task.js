const express = require("express");
const Task = require("../models/task");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");



// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt_asc
router.get("/tasks", auth , async (req,res) => {
    const match = {};
    const sort = {};
    if(req.query.completed) {
        match.completed = req.query.completed === "true" 
    }
    
    if(req.query.sortBy) {
         const parts = req.query.sortBy.split("_")
         sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        // console.log(req.user);
        // const user = await User.findById(req.user._id);
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(200).send(req.user.tasks);
    } catch(e) {
        res.status(500).send(e);
    }
})

router.get("/tasks/:id", auth, async (req,res) => {
    const id = req.params.id;
    try {
        const task = await Task.findOne({_id: id, owner: req.user._id});
        console.log(task);
        if(!task)
            return res.status(404).send();
        res.status(200).send(task);
    } catch(e) {
        res.status(500).send(e);
    }
})


router.post("/tasks", auth , async(req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.patch("/tasks/:id", auth, async (req,res) => {
    const id = req.params.id;

    const allowedUpdates = ["completed"];
    const updates= Object.keys(req.body);
    const isValidOperation = updates.every(item => {
        return allowedUpdates.includes(item);
    })

    if(!isValidOperation)
        return res.status(400).send({error: "Not valid arguements"});
    
    try {
        // const task = await Task.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

        const task = await Task.findOne({_id: id, owner: req.user._id});
        if(!task)
            return res.status(404).send({error: "task not found"});
        
        updates.forEach((update) => task[update] = req.body[update]);

        await task.save()
        res.status(200).send(task);

    } catch(e) {
        res.status(500).send(e); 
    }
})

router.delete("/tasks/:id", auth, async(req, res) => {
    const id= req.params.id;
    try {
        const task = await Task.findOneAndDelete({_id: id, owner: req.user._id});
        if(!task)
            return res.status(404).send();
        res.status(200).send(task);
    } catch(e) {
        res.status(500).send(e);
    }
})

module.exports = router;