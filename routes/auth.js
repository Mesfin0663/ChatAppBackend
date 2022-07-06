const router = require("express").Router(); //imports express
const User = require("../models/User"); // imports database model User from models folder
const bcrypt = require("bcrypt");  //imports bcrypt for hashing and salting

//USER REGISTER 
router.post("/register", async (req,res)=>{
    const {username , email, passsword} = req.body;  // destructuring request json 
    const userExits = await User.findOne({email}) // searchis the user using email from the database 
    if(userExits){
        res.status(400).json("user already exists"); // if the user exists do nothing 
        
    }else{
        try{
       
            // add salt to the password and hash it
            const salt = await bcrypt.genSalt(10); 
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            }); 
            const user = await newUser.save();   // save the user on the database
            res.status(200).json(user); // return the saved user data 


        }catch(err){
            console.log(err.code)
            if(err.code == 11000){
                res.status(404).json(err);
            }
            
        }
    }
    
})


//USER LOGIN
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({email: req.body.email}); // tries to find
        !user && res.status(404).json("user not found");
        
        if(user){
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            !validPassword && res.status(400).json("wrong password");
            res.status(200).json(user);

        }
      
    
  
    }catch (err){
        res.status(500).json(err);
    }
})
module.exports =router