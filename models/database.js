const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/passport-facebook')

const userSchema = mongoose.Schema({
  name : String,
  facebookID : String
})

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;