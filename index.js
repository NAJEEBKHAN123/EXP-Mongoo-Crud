const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL;  // MongoDB URL from environment variables

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB successfully connected");
  })
  .catch((err) => {
    console.log("Error in MongoDB connecting:", err.message);
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

// FETCHING ALL USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in fetching users" });
  }
});

// CREATE USER
app.post("/users", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json({ message: "User created", data: savedUser });
  } catch (err) {
    console.log("Error in creating user:", err.message);
    res.status(500).json({ message: "Error in creating user" });
  }
});

// UPDATE USER BY ID
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
      },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (err) {
    console.log("Error in updating user:", err.message);
    res.status(500).json({ message: "Error in updating user" });
  }
});

// DELETE USER BY ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: `User with ID ${req.params.id} deleted` });
  } catch (err) {
    console.log("Error in deleting user:", err.message);
    res.status(500).json({ message: "Error in deleting user" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port http:localhost:${PORT}`);
});
