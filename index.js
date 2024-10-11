const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

// const mongoUrl = process.env.MONGO_URL;   // Set this in Vercel environment variables
const mongoUrl = "mongodb://127.0.0.1:27017/user-managment";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb successsfully connected");
  })
  .catch((err) => {
    console.log("error in mongodb connecting ", err.message);
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

//FETCHING ALL USERS

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error in fetching users" });
  }
});

//CREATE USERS
app.post("/users", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  });
  try {
    const allUser = await newUser.save();
    res.status(200).json({ message: "ceating new user", data: allUser });
  } catch (err) {
    console.log("error in creating new user");
    res.status(500).json("error in creating new user", err.message);
  }
});

//UPDATE USER BY ID

app.put("/users/:id", async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
      },
      { new: true }
    );
    if(!updateUser){
      res.status(404).json({message: "404 not found!"})
    }
    res.status(200).json({message: "update user successful", data: updateUser})
  } catch (err) {
    console.log('error in updating user')
    res.status(500).json({message: "error in updating user",})
  }
});

//DELETE USERS

 app.delete('/users/:id', async(req, res) =>{
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id)
    if(!deleteUser){
      res.status(404).json({message: "404 not found!"})
    }
    res.status(200).json({message: `delete user with ID ${req.params.id} `,})
  } catch (err) {
    console.log("error in deleting user")
    res.status(500).json({message: "error in deleting user"})
  }
 })


 const PORT = process.env.PORT || 3000; // Use the port assigned by Vercel
app.listen(PORT, () => {
  console.log(`Server is listining in http://localhost:${PORT}`);
});
