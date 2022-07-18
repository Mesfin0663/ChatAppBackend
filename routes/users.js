// User update,delete,get, follow, unfollow

const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async(req,res)=>{
  if(req.body.userId === req.params.id || req.body.isAdmin){
     if(req.body.password){
      try{
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }catch (err){
        return res.status(500).json(err);
      }
     }
     try{
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated !!")

     }catch(err){
      return res.status(500).json(err);
     }
  }else{
    return res.status(403).json("You can update only your account")
  }
})


//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});


//get a user with id 
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
     console.log(user);
    const { password, updatedAt, ...other } = user._doc;
   
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a user with both id and username
router.get("/", async (req,res)=>{
  const userId = req.query.userId;
  const username = req.query.username;
  try{
    const user = userId
    ? await User.findById(userId)
    : await User.findOne({username: username});
    const {password, updatedAt, ...other} = user._doc;
    res.status(200).json(other);
  }catch(err){
    res.status(500).json(err)
  }
})
//follow a user
// router.put("/:id/follow", async(req,res)=>{
//   if(
//     req.body.userId   //follower
//    !== 
//    req.params.id // to be followed
//    ){
//     try{
//       const user = await User.findById(req.params.id); // to be followed object
//       const currentUser = await User.findById(req.body.userId); // follower object
//       if(
//         !user.followers.includes(req.body.userId) //checkes if the follwer is already in the follower list of the followed object
      
//       ){

//            await user.updateOne({$push: {followers: req.body.userId}});// adding the follower in the follower list of the followed object
//            await currentUser.updateOne({$push: {followings: req.params.id}})// adding followed object in the following list of the current follower or the current user
//            res.status(200).json("user has been successfuly folowed")
//           }else{
//         res.status(403).json("you already follow this user")
//       }
//     } catch(err){
//       res.status(500).json(err);
//     }
//   }else{
//     res.status(403).json("you cant follow yourself");
//   }
// })

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});
// unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

// router.get("/:id", async (req, res) => {
//    try {
//      const user = await User.findById(req.params.id);
//      const { password, updatedAt, ...other } = user._doc;
//      res.status(200).json(other);
//    } catch (err) {
//      res.status(500).json(err);
//    }
//  });

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports =router