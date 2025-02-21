import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    // Basic User Info
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    avatar: String,
    
    // User Settings
    settings: {
        notifications: {
            emailAlerts: { type: Boolean, default: true },
            newMessageAlerts: { type: Boolean, default: true },
            pushNotifications: { type: Boolean, default: false },
            showOnlineStatus: { type: Boolean, default: true },
            notificationSound: { type: Boolean, default: true }
        }
    },
    
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Password & Auth methods remain the same
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { 
            id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const User = mongoose.model('User', userSchema);
