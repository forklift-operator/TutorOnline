import { Message } from './../../client/src/common/commonTypes';
import { ObjectId } from 'mongodb';
// import { RoomModel } from "./db/models/RoomModel.js";
// import { CourseModel } from "./db/models/CourseModel.js";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { ILesson, LessonModel } from "./db/model/lessonModel";
// import { ObjectId } from "mongodb";


interface JoinRoomPayload {
    lessonId: string;
    peerId: string;
    userId: string;
}

interface ActiveUser {
    peerId: string;
    socketId: string;
    user: any; // Replace 'any' with ObjectId if imported
}

interface Lesson {
    _id: any; // Replace 'any' with ObjectId if imported
    activeUsers: ActiveUser[];
    logs: any[]; // Replace 'any' with the type of log if known
}

interface Course {
    lessons: Lesson[];
    save: () => Promise<void>;
}

interface SendMessageData {
    // Define properties of the message if known
    [key: string]: any;
}


export const connectIO = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connect", (socket: Socket) => {
        // joining room
        socket.on("user_ready", async ({ peerId, lessonId }: JoinRoomPayload) => {

            let lesson: ILesson = null;

            try {
                if (ObjectId.isValid(lessonId)) {
                    lesson = await LessonModel.findById(new ObjectId(lessonId));
                } else throw Error('Lesson id not valid');
            } catch (e) {
                console.error((e as Error).message);
                socket.emit('error', { message: (e as Error).message });
            }
            if (!lesson) return
            
            
            socket.on('join', () => {
                
                socket.join(lessonId);
                socket.broadcast.to(lessonId).emit('new_user', peerId)

                socket.emit('chat_history', lesson.logs);

                socket.on('sent_message', async (message: Message) => {
                    socket.broadcast.to(lessonId).emit('new_message', message);
    
                    lesson.logs.push(message);
                    try {
                        await LessonModel.findByIdAndUpdate(lessonId, lesson);
                    } catch (e) {
                        console.error((e as Error).message);
                        socket.emit('error', { message: (e as Error).message });
                    }
                })
                
            })
            
            
            socket.on('leave', () => {
                socket.broadcast.to(lessonId).emit('user_left', peerId)
            })
            
            socket.on('close', async () => {
                try {
                    await LessonModel.findByIdAndUpdate(lessonId, {isOpen: false}); 
                } catch (e) {
                    socket.emit('error', { message: (e as Error).message });
                }
            })

            socket.on("disconnect", () => {
                console.log('Socket disconnected:', socket.id);
                socket.broadcast.to(lessonId).emit('user_left', peerId);
            });


            // const newRoom = new RoomModel({ lessonId, users: [] });
            // await newRoom.save();
            // console.log(newRoom._id);
            // return;

            // if (!ObjectId.isValid(lessonId)) {
            //     return socket.emit("error", { message: "Invalid room id" });
            // }

            // if (!ObjectId.isValid(userId)) {
            //     return socket.emit("error", { message: "Invalid user id" });
            // }

            // const query = { "lessons._id": new ObjectId(lessonId) };

            // try {
            //     // const room = await RoomModel.findOne(query);
            //     const course: Course = await CourseModel.findOne(query);
            //     const lesson: Lesson = course.lessons.find(
            //         lesson => lesson._id.toString() === lessonId
            //     );

            //     console.log(lesson);

            //     if (!lesson) return socket.emit("error", { message: "Room not found" });


            //     const existingUser = lesson.activeUsers.find(({user}) => user.toString() === userId);

            //     if (existingUser) {
            //         existingUser.peerId = peerId;
            //         existingUser.socketId = socket.id;
            //     } else {
            //         lesson.activeUsers.push({ peerId, socketId: socket.id, user: new ObjectId(userId) });
            //     }
            //     console.log("asdasd");

            //     await course.save();

            //     socket.join(lessonId);
            //     socket.to(lessonId).emit("new_user", peerId);

            //     // socket.emit("existing_users", { users: room.users.reduce((acc, user) => {
            //     //     acc[user.peerId] = user;
            //     //     return acc;
            //     // }, {}) });

            //     socket.emit("chat_history", { history: lesson.logs });

            //     console.log("User joined", lessonId);

            //     // message handling
            //     socket.on("send_message", async (data: SendMessageData) => {
            //         socket.to(lessonId).emit("receive_message", data);

            //         try {

            //             if (lesson) {
            //                 lesson.logs.push(data);
            //                 await course.save();
            //             } else {
            //                 console.error(`Room with ID ${lessonId} not found`);
            //             }

            //         } catch (e: any) {
            //             console.error("Error with message handling:",e.message);
            //         }
            //     });

            //     // disconnection logic
            //     socket.on("disconnect", async () => {
            //         try {
            //             const course: Course = await CourseModel.findOne({ "lessons._id": new ObjectId(lessonId) });
            //             const lesson: Lesson = course.lessons.find(lesson => lesson._id.toString() === lessonId);
            //             // const room = await RoomModel.findOne({ _id: new ObjectId(lessonId) });
            //             if (lesson) {
            //                 lesson.activeUsers = lesson.activeUsers.filter((user) => {
            //                     if (user.socketId === socket.id) {
            //                         socket.to(lessonId).emit('user_left', { peerId: user.peerId });
            //                         console.log('user left', user.peerId);
            //                     }else return user;
            //                 });
            //                 await lesson.save();
            //             }
            //         } catch (e: any) {
            //             console.error("Error handling disconnect:", e);
            //         }

            //         console.log('A user disconnected',socket.id);
            //     });


            // } catch (e: any) {
            //     console.error(e.message);
            // }
        });

    });
};

