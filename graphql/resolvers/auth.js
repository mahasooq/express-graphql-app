const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../../models/user");


module.exports = {
  
  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error('user already existing');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      let createdUser = await new User({
        email: args.userInput.email,
        password: hashedPassword
      }).save();
      return { ...createdUser._doc, password: null, _id: createdUser.id };

    } catch (err) {
      throw new err;
    }
  },

  login : async ( args )=> {
    
    try {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error('user not existing');
      }
      
      const isEqual = await bcrypt.compare(args.password, user.password);      
      if(!isEqual) {
        throw new Error("password is not correct");
      }

      const token = jwt.sign({userID : user.id, email : user.email}, 'graphqlkey', {
        expiresIn : "1h"
      });
      return {
        userID : user.id, token : token, tokenExpiration : 1
      }
    } catch (error) {
      throw error;
    }
  }
}