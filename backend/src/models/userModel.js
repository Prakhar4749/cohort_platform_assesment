import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true // Best practice for email fields
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    communityName: {
        type: String,
        required: [true, 'Community name is required'],
        trim: true
    },
    communityUsername: {
        type: String,
        required: [true, 'Community username is required'],
        unique: true,
        trim: true
    },
    membershipType: {
        type: String,
        enum: ['Free', 'Paid'],
        default: 'Free'
    },
    communityType: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public'
    },
    country: String,
    description: String,
    profileImages: [String],
    level: {
        currentLevel: { type: Number, default: 1 },
        details: String,
        progress: { type: Number, default: 0 }
    },
    permissions: {
        canPost: { type: Boolean, default: true },
        canChat: { type: Boolean, default: true },
        canAddMembers: { type: Boolean, default: false }
    },
    notifications: {
        emailAlerts: { type: Boolean, default: true },
        newMessageAlerts: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: false },
        showOnlineStatus: { type: Boolean, default: true },
        notificationSound: { type: Boolean, default: true }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// // Index creation for frequently queried fields
// userSchema.index({ email: 1 });
// userSchema.index({ communityUsername: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Instance methods
userSchema.methods = {
    // Compare password
    comparePassword: async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    },

    // Generate JWT token
    generateAuthToken: function() {
        return jwt.sign(
            { id: this._id,
                email: this.email,
                communityUsername:this.communityUsername
             },
            process.env.JWT_SECRET,
            { expiresIn: '1hr' }
        );
    }
};
const User = mongoose.model('User', userSchema);

export { User };