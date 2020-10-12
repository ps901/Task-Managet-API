require("../src/db/mongoose");
const User = require("../src/models/user");

// 5f6ee7cfa8c44205f0c23e69

// User.findByIdAndUpdate("5f6ee7cfa8c44205f0c23e69", { age: 1}).then((user) =>{
//     console.log(user);
//     return User.countDocuments({age: 1})
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// })

const updateAgeAndCount = async(id, age) => {
    const user = await User.findByIdAndUpdate(id, {age});
    const count = await User.countDocuments({age});
    return count;
}

updateAgeAndCount("5f6ee7cfa8c44205f0c23e69", 2).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
})