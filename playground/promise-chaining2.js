require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("5f6e8bec3b56ba03e807ec6d").then((task) => {
//     console.log(task);
//     return Task.countDocuments({completed: false});
// }).then((count) => {
//     console.log(count);
// }).catch((err) => {
//     console.log(err);
// })

const deleteTaskAndCount = async(id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false});

    return count;
}

deleteTaskAndCount("5f71951f4d820b37403ab0a5").then((result) => {
    console.log("ans: ", result);
}).catch((err) => {
    console.log("err", err);
})