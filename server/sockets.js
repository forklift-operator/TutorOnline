import { RoomModel } from "./db/models/RoomModel.js";
import { Server } from "socket.io";
import { ObjectId } from "mongodb";


export const connectIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"] 
        }
    })

    io.on("connect", socket => {
    
        // joining room
        socket.on("join_room", async ({ roomId, peerId, userId }) => {
            // const newRoom = new RoomModel({ roomId, users: [] });
            // await newRoom.save();
            // console.log(newRoom._id);
            // return;
            
            if (!ObjectId.isValid(roomId)) {
                return socket.emit("error", { message: "Invalid room id" });
            }
        
            if (!ObjectId.isValid(userId)) {
                return socket.emit("error", { message: "Invalid user id" });
            }
        
            const query = { _id: new ObjectId(roomId) };
        
            try {
                const room = await RoomModel.findOne(query);
                if (!room) return socket.emit("error", { message: "Room not found" });

        
                const existingUser = room.users.find(user => user.id.toString() === userId);
                if (existingUser) {
                    existingUser.peerId = peerId;
                    existingUser.socketId = socket.id;
                } else {
                    room.users.push({ peerId, socketId: socket.id, id: userId  });
                }
        
                await room.save();
        
                socket.join(roomId);
                socket.to(roomId).emit("new_user", peerId);
        
                // socket.emit("existing_users", { users: room.users.map((user) => user.peerId) });
                socket.emit("existing_users", { users: room.users.reduce((acc, user) => {
                    acc[user.peerId] = user;
                    return acc;
                }, {}) });

                socket.emit("chat_history", { history: room.logs });
        
                console.log("User joined", roomId);

                // message handling
                socket.on("send_message", async (data) => {
                    socket.to(roomId).emit("receive_message", data);
            
                    try {
                        const query = { _id: new ObjectId(roomId) };
                        const room = await RoomModel.findOne(query);

                        if (room) {
                            room.logs.push(data);
                            await room.save();
                        } else {
                            console.error(`Room with ID ${roomId} not found`);
                        }
                        
                    } catch (e) {
                        console.error("Error with message handling:",e.message);
                    }
                });
                
                // disconnection logic
                socket.on("disconnect", async () => {
                    try {
                        const room = await RoomModel.findOne({ _id: new ObjectId(roomId) });
                        if (room) {
                            room.users = room.users.filter((user) => {
                                if (user.socketId === socket.id) {
                                    socket.to(roomId).emit('user_left', { peerId: user.peerId });
                                    console.log('user left', user.peerId);
                                }else return user;
                            });
                            await room.save();
                        }
                    } catch (e) {
                        console.error("Error handling disconnect:", e);
                    }
            
                    console.log('A user disconnected',socket.id);
                });

                
            } catch (e) {
                console.error(e.message);
            }
        });
    
    })
}

