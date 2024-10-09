const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')


const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());


const mongoUrl ='mongodb://127.0.0.1:27017/user-managment';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('Mongodb successsfully connected')
}).catch((err) =>{
    console.log("error in mongodb connecting ", err.message)
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
   age:{
    type: Number
   }
})

const User = mongoose.model("User", userSchema);

//fetching all users
app.get('/users', async(req, res) =>{
    try{
        const users = await User.find()
        res.status(200).json(users)
    }catch(err){
        console.log("user fetching error", err)
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
})

//CREATE USERS
app.post('/users', async(req, res) =>{
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
    })
    try {
        const allUser = await newUser.save();
        res.status(200).json(allUser)

    } catch (err) {
        console.log("user fetching error", err)
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
})

//Updation 
app.put('/users/:id', async(req, res) =>{
   
    const userId = await User.findByIdAndUpdate(req.params.id)
    console.log(userId)
    res.status(200).json(userId)
})

app.listen(PORT, () =>{
    console.log(`Server is listining in http://localhost:${PORT}`)
})