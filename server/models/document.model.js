const { model, Schema } = require('mongoose');


const docSchema = new Schema({

     author: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'user' 
     },

     title: {
          type: String,
          required: true,
     },

     isPublic: {
          type: Boolean,
          default: false
     },

     doc: {
          type: Object,
          default: ""
     }
}, { timestamps: true });



module.exports = model('Document', docSchema);

