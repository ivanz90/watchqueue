const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const User = require("./model/user");
const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");
const JWT_SECRET = "jKy6YpZ89YNbns7wF"
mongoose.connect("mongodb://127.0.0.1:27017/administration", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});;
const app = express();
app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

//register endpoint
app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword, email } = req.body;
  //console.log("Received values:", username, plainTextPassword, email);
  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }
  if (plainTextPassword.length < 5) {
    return res.json({ status: "error", error: "Password too short" });
  }
  const password = await bcrypt.hash(plainTextPassword, 10);
 //console.log(password)
  const userId = randomUUID();
  try {
    const response = await User.create({ username, password, email, userId });
   // userId = response.userId;
    console.log("user created successfully", response);
  } catch (error) {
    if (error.code == 11000) {
      return res.json({ status: "error", error: "Username in use" });
    }
    throw error;
  }
  res.json({ status: "ok", userId });
});

//login endpoint
app.post("/api/login", async(req,res)=>{
    const {username, password}= req.body;
    const user = await User.findOne({username}).lean();
    if(!user){
        return res.json({status:"error", error:"Invalid username"})
    }
    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            JWT_SECRET
        );
        const userId=user.userId;
        return res.json({status:"ok", token:token, userId:userId})
    } else{
        return res.json({status:"error", error:"Invalid password"} )
    }
})

app.listen(3000, () => {
  console.log("Server online");
});
