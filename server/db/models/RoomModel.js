import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    users: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "User",
                required: true,
            },
            peerId: {
                type: String,
                required: true,
            },
            socketId: {
                type: String,
                required: true,
            },
        },
    ],
    logs: [
        {
            sender: {
                id: {
                    type: String,
                    required: true
                },
                username: {
                    type: String,
                    required: true
                },
            },
            content: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
                default: Date.now,
            }
        }
    ],
    opened: {
        type: Boolean,
        default: true,
        required: true,
    }
})

const RoomModel = mongoose.model('Session', RoomSchema);

export { RoomModel };