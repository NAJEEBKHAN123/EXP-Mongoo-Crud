const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection string
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://najeebkhan:najeebkhan12@user-management-cluster.zkw9a.mongodb.net/user-management?retryWrites=true&w=majority&appName=user-management-cluster";

// Connect to MongoDB
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB successfully connected");
  })
  .catch((err) => {
    console.log("Error in MongoDB connection:", err.message);
  });

// User schema and model
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

// Fetching all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in fetching users" });
  }
});

// Create users
app.post("/users", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  });
  try {
    const allUser = await newUser.save();
    res.status(201).json({ message: "Creating new user", data: allUser }); // Status code changed to 201
  } catch (err) {
    console.log("Error in creating new user:", err.message);
    res.status(500).json({ message: "Error in creating new user", error: err.message }); // Corrected error handling
  }
});

// Update user by ID
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
    if (!updateUser) {
      return res.status(404).json({ message: "404 not found!" });
    }
    res.status(200).json({ message: "Update user successful", data: updateUser });
  } catch (err) {
    console.log("Error in updating user:", err.message);
    res.status(500).json({ message: "Error in updating user" });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      return res.status(404).json({ message: "404 not found!" });
    }
    res.status(200).json({ message: `Deleted user with ID ${req.params.id}` });
  } catch (err) {
    console.log("Error in deleting user:", err.message);
    res.status(500).json({ message: "Error in deleting user" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use the port assigned by Vercel
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
