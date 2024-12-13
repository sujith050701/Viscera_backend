const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rsujith776:Sujith2005@cluster0.j97lo.mongodb.net/login?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("MongoDB Atlas connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
