const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'O titulo do video é obrigatorio'],
        trim: true,
        maxlength: [100, 'O titulo não pode excerder 100 caracteres']
       },
       description : {
        type: String,
        required: [true, 'A descrição do video é obrigatorio'],
        trim: true,
        maxlength: [500, 'A descrição não pode exceder 500 caracteres']
       },
       url: {
        type: String,
        trim: true,
        match: [/^(https|https):\/\/[^ "]+$/, 'URL invalida']
       },
       duration: {
        type: Number,
        required: true,
        min: [1, 'A duração do video não pode ser menor que 1 segundo']
       },
       uploader: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
       },
       tags: {
        type: [String],
        enum: ['flagra', 'famoso', 'favorito']
       },
       createdAt: {
        type: Date,
        default: Date.now
       },
         updatedAt: {
          type: Date,
          default: Date.now
         }
});

videoSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model('video', videoSchema);