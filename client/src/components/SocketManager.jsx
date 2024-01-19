
import { useEffect } from "react"
import { io } from "socket.io-client"
import { useAtom, atom } from 'jotai'

export const socket = io("http://localhost:3001")
export const charactersAtom = atom([]);
export const userAtom = atom(null);


export const SocketManager = () => {
    const [_characters, setCharacters] = useAtom(charactersAtom);
    const [_user,setUser] =useAtom(userAtom);
    useEffect(() =>{
        function onConnect(value){
            setUser(value);
            console.log(value);
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

        socket.on("connected", onConnect);
        socket.on("disconnect",onDisconnect);
        socket.on("hello",onHello);
        socket.on("characters",onCharacters);


        return () => {
            socket.off("connected", onConnect);
            socket.off("disconnecte", onDisconnect);
            socket.off("hello", onHello);
            socket.off("characters",onCharacters);
        }
    },[]);
}