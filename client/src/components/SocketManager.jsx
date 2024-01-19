
import { useEffect } from "react"
import { io } from "socket.io-client"
import { useAtom, atom } from 'jotai'

export const socket = io("http://localhost:3001")
export const charactersAtom = atom([]);


export const SocketManager = () => {
    const [characters, setCharacters] = useAtom(charactersAtom);
    useEffect(() =>{
        function onConnect(){
            console.log("Bienvenido");
        }
        function onDisconnect(){
            console.log("disconnected");
        }
        function onHello(){
            console.log("hello");
        }
        function onCharacters(value){
            setCharacters(value);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect",onDisconnect);
        socket.on("hello",onHello);
        socket.on("characters",onCharacters);


        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnecte", onDisconnect);
            socket.off("hello", onHello);
            socket.off("characters",onCharacters);
        }
    },[]);
}