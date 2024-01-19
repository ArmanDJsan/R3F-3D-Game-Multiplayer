import { Server } from 'socket.io';
import { Socket } from 'socket.io';

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    },
})

io.listen(3001);

const characters = [];


const newRandomPosition = () => {
    return [Math.floor(Math.random() * 5), 0, Math.floor(Math.random() * 5)];
}
const newRandomColor = () => {
    return ('#' + Math.round(Math.random() * 16777215 + 1).toString(16));
}

io.on("connection", (socket) => {

    console.log("user connected");
    const id= socket.id;
    socket.emit("connected", id);
    characters.push({
        id: socket.id,
        position: newRandomPosition(),
        hairColor: newRandomColor(),
        topColor: newRandomColor(),
        bottomColor: newRandomColor(),
        shoesColor: newRandomColor()
    })
    io.emit("characters", characters);
    socket.on("disconnect", () => {
        console.log("user disconnected...");
        characters.splice(
            characters.findIndex((character) => character.id === socket.id), 1
        )
        io.emit("characters", characters);
    });
    socket.on("move", (position) => {
        const character = characters.find((character) => character.id === socket.id);
        character.position = position;
        io.emit("characters", characters);
    }) 
});