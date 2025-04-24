import { RoomModel } from "./db/models/RoomModel.js";
import { CourseModel } from "./db/models/CourseModel.js";
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
        socket.on("join_room", async ({ lessonId, peerId, userId }) => {
            console.log(socket.id);
            // const newRoom = new RoomModel({ lessonId, users: [] });
            // await newRoom.save();
            // console.log(newRoom._id);
            // return;
            
            if (!ObjectId.isValid(lessonId)) {
                return socket.emit("error", { message: "Invalid room id" });
            }
        
            if (!ObjectId.isValid(userId)) {
                return socket.emit("error", { message: "Invalid user id" });
            }
        
            const query = { "lessons._id": new ObjectId(lessonId) };
        
            try {
                // const room = await RoomModel.findOne(query);
                const course = await CourseModel.findOne(query);
                const lesson = course.lessons.find(
                    lesson => lesson._id.toString() === lessonId
                )
                
                console.log(lesson);
                
                if (!lesson) return socket.emit("error", { message: "Room not found" });

        
                const existingUser = lesson.activeUsers.find(({user}) => user.toString() === userId);
                
                if (existingUser) {
                    existingUser.peerId = peerId;
                    existingUser.socketId = socket.id;
                } else {
                    lesson.activeUsers.push({ peerId, socketId: socket.id, user: new ObjectId(userId) });
                }
                console.log("asdasd");
        
                await course.save();
        
                socket.join(lessonId);
                socket.to(lessonId).emit("new_user", peerId);
        
                // socket.emit("existing_users", { users: room.users.reduce((acc, user) => {
                //     acc[user.peerId] = user;
                //     return acc;
                // }, {}) });

                socket.emit("chat_history", { history: lesson.logs });
        
                console.log("User joined", lessonId);

                // message handling
                socket.on("send_message", async (data) => {
                    socket.to(lessonId).emit("receive_message", data);
            
                    try {

                        if (lesson) {
                            lesson.logs.push(data);
                            await course.save();
                        } else {
                            console.error(`Room with ID ${lessonId} not found`);
                        }
                        
                    } catch (e) {
                        console.error("Error with message handling:",e.message);
                    }
                });
                
                // disconnection logic
                socket.on("disconnect", async () => {
                    try {
                        const course = await CourseModel.findOne({ "lessons._id": new ObjectId(lessonId) });
                        const lesson = course.lessons.find(lesson => lesson._id.toString() === lessonId);
                        // const room = await RoomModel.findOne({ _id: new ObjectId(lessonId) });
                        if (lesson) {
                            lesson.activeUsers = lesson.activeUsers.filter((user) => {
                                if (user.socketId === socket.id) {
                                    socket.to(lessonId).emit('user_left', { peerId: user.peerId });
                                    console.log('user left', user.peerId);
                                }else return user;
                            });
                            await lesson.save();
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

