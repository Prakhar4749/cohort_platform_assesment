import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Community name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Community username is required'],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public'
    },
    membershipType: {
        type: String,
        enum: ['Free', 'Paid'],
        default: 'Free'
    },
    description: {
        type: String,
        maxLength: [500, 'Description cannot exceed 500 characters']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    images: [{
        url: String,
        publicId: String
    }],
    
    // Owner of the community
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Community settings
    settings: {
        permissions: {
            canPost: { type: Boolean, default: true },
            canChat: { type: Boolean, default: true },
            canAddMembers: { type: Boolean, default: false }
        }
    },
    
    socialAccounts: {
        website: String,
        googleMeet: String,
        msTeams: String
    },

    // Payment methods for future payments
    paymentMethods: [{
        type: {
            type: String,
            enum: ['card', 'bank', 'upi'],
            required: true
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        // For card payments
        cardDetails: {
            lastFourDigits: String,
            cardType: String,
            expiryMonth: String,
            expiryYear: String,
            cardHolderName: String
        },
        // For bank account
        bankDetails: {
            accountNumber: String,
            bankName: String,
            accountHolderName: String,
            ifscCode: String
        },
        // For UPI
        upiDetails: {
            upiId: String,
            upiHolderName: String
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export const Community = mongoose.model('Community', communitySchema);