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
app.get('/', async(req, res) =>{
    try{
        const users = await User.find()
        res.status(200).json(users)
    }
})

//CREATE USERS


app.listen(PORT, () =>{
    console.log(`Server is listining in http://localhost:${PORT}`)
})