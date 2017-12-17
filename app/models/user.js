const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  name: String,
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user', UserSchema);

module.exports = User;
