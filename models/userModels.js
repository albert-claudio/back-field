import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { verify } from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
        maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, informe um email válido'
        ]
    },
    password: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'Senha precisa ter no mínimo 6 caracteres'],
        select: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    } 
})

//Criptografar senha antes de salvar
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//Comparar senha
userSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password);
}


//Gerar token
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  };

export const User = mongoose.model('User', userSchema);
export default User