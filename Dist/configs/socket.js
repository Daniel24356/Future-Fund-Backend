"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
exports.io = new socket_io_1.Server({
    cors: {
        origin: "*",
    },
});
const setupSocket = (server) => {
    exports.io.attach(server);
    exports.io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
    });
};
exports.setupSocket = setupSocket;
