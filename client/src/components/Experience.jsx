import { ContactShadows, Environment, OrbitControls, useCursor } from "@react-three/drei";
import { AnimatedWoman } from './AnimatedWoman'
import { useAtom } from "jotai";
import { charactersAtom, socket } from "./SocketManager";
import { useState } from "react";
import * as THREE from "three";

export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  const [onFloor, setOnFloor ] = useState(false);
  useCursor(onFloor);

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <ContactShadows blur={2} />
      <OrbitControls />
      <mesh
        rotation-x={-Math.PI / 2}
        position={-0.001}
        onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z]) }
        onPointerEnter={(e) => setOnFloor(true)}
        onPointerLeave={(e) => setOnFloor(false)}
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={"#f0f0f0"} />
      </mesh>
      {characters.map((char) => (
        <AnimatedWoman
          key={char.id}
          id={char.id}
          position={new THREE.Vector3(char.position[0],char.position[1],char.position[2])}
          topColor={char.topColor}
          bottomColor={char.bottomColor}
          hairColor={char.hairColor}
          shoesColor={char.shoesColor} />
      ))}
    </>
  );
};
/*  */