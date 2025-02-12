const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
public_id: {
    type: String,
    required: true,
},
url: {
    type: String,
    required: true,
},
format: {
    type: String,
    enum: ['jpg', 'jpeg', 'png', 'gif', 'webp']
},
width: Number,
height: Number,
relatedVideo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
},
uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
createdAt: {
    type: Date,
    default: Date.now
}
})