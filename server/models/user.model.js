
const mongoose = require("mongoose");


const userSchema = mongoose.Schema({

     username: {
          type: String,
          required: true,
          immutable: true
     },

     avatarURL: {
          type: String,
          default: "https://cdn-icons-png.flaticon.com/512/666/666201.png"
     },

     email: {
          type: String,
          required: true,
          immutable: true,
          unique: true
     },

     password: {
          type: String,
          required: true
     }
}, { versionKey: false, timestamps: true });
// The options object is provided as the second argument to the Schema constructor
// We set `versionKey` to false to exclude the "__v" field from documents
// We set `timestamps` to true to automatically add "createdAt" and "updatedAt" fields

const UserModel = mongoose.model('user', userSchema);


module.exports = { UserModel };
