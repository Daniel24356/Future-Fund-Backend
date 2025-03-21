import { Server } from "socket.io";

export const io = new Server({
    cors: {
        origin: "*",
    },
});

export const setupSocket = (server: any) => {
    io.attach(server);
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
    });
};
