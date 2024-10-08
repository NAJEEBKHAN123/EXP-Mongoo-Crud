const mongoose = require('mongoose')
const express = require('express')

const PORT = 3000;
const app = express();


main().then(() =>{
    console.log("connectin is working")
}).catch((err) =>{console.log(err)})
async function main() {
    await mongoose.connect('mongodb:127.0.0.1:27017/user-managment');
}
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
})

const User = mongoose.model("User", userSchema);
const user1 = new User({
    name: "najeeb",
    email: 'najeebkhan@gamil.com',
    age: 23,
})
user1.save().then((data) =>{
    console.log(data)
}).catch((err) =>{
    console.log(err)
})
app.get('/', (req, res) =>{
    res.send("fetching all users")
})

app.listen(PORT, () =>{
    console.log(`Server is listining in http://localhost:${PORT}`)
})