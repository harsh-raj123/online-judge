const express = require('express');
const app = express();
const { DBConnection } = require("./Database/db");
const User = require("./Models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const PORT = process.env.PORT || 3000;
const problemRoutes = require("./routes/problemRoutes");
//require("dotenv").config(); 

DBConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/problems", problemRoutes);

app.get("/", (req, res) => {
    res.send("hello worldkk");

})
app.post("/register", async (req, res) => {
    //get all the data from frontend
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);

    //check all the data should exist


    if (!(firstName && lastName && email && password)) {
        return res.status(400).send("enter all the information");
    }
    console.log(req.body);
    //add more validation 
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send("User alredy exists with the same email");
    }
    //hashing/encrypting the data
    const hashedPassword = await bcrypt.hash(password, 10);
    //store the user in the db
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });
    //generate a token for user and send it 
    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    user.token = token;
    user.password = undefined;
    res.status(200).json({ message: 'you have been successfully registered', user })
})
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    //s1-validate input
    if (!email || !password) {
        return res.status(400).send("email and password are required");
    }
    try {
        //s2-check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("user not found");
        }
        //s3-compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).send("Invalid Password");
        }
        //s4-generate a token
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        user.token = token;
        user.password = undefined;
        //s5-send response
        res.status(200).json({
            message: "login successful", user
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
})
    ;

console.log("reached");
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);

})