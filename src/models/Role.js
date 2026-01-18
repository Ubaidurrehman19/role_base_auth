import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    permissions: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
