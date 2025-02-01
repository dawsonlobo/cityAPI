import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export const initializeSocket = (server: HTTPServer) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        path: "", // ✅ Explicit WebSocket path
    });

    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on("message", (data) => {
            console.log(`Message received:`, data);
            io.emit("message1", data); // Broadcast message to all clients
        });

        socket.on("calculateSquareRoot", (data) => {
            console.log("Received input:", data);
        
            // Regular expression to check if the input is a valid number
            const isValidNumber = /^[+-]?\d+(\.\d+)?$/;
        
            if (!isValidNumber.test(data)) {
                // If the input is not a valid number, send an error message
                io.emit("squareRootResult", { message: "Invalid input. Please provide a valid number." });
            } else {
                // Convert the string input to a number
                const number = parseFloat(data);
        
                // Calculate the square root and round it to 2 decimal places
                const result = Math.sqrt(number).toFixed(2);
        
                // Send the result back to the client
                io.emit("squareRootResult", { result: result });
            }
        });

        // For Postman: Handling custom event format
        socket.on("customEvent", (payload) => {
            console.log("Received custom event:", payload);
            io.emit("response", { message: "Event received!", payload });
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    console.log("✅ Socket.io initialized.");
    return io;
};