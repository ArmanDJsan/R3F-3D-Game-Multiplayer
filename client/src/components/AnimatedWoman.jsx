import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame, useGraph } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'
import { useAtom } from 'jotai'
import { userAtom } from './SocketManager'
import { Vector3 } from 'three'
import * as THREE from 'three'


export function AnimatedWoman({
  hairColor = "white",
  topColor = "blue  ",
  bottomColor = "brown",
  shoesColor = "black",
  id,
  ...props
}) {
  const MOVEMENT_SPEED = 0.032;
  const position = useMemo(() => props.position, []);
  const group = useRef()
  const { scene, materials, animations } = useGLTF('/models/AnimatedWoman.glb')
  //skinned meshes cannot be re-used in threejs wothout cloning the
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  //useGraph create two flat oject collectios for nodes and materials
  const { nodes } = useGraph(clone)

  const { actions } = useAnimations(animations, group)
  const [animation, setAnimation] = useState("CharacterArmature|Idle")

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [animation]);

  const [user] = useAtom(userAtom);
  useFrame((state) => {

    if (group.current.position.distanceTo(props.position) > 0.1) {
      const direction = group.current.position
        .clone()
        .sub(props.position)
        .normalize()
        .multiplyScalar(MOVEMENT_SPEED);
      group.current.position.sub(direction);
      group.current.lookAt(props.position);
      setAnimation("CharacterArmature|Run");
    } else {
      setAnimation("CharacterArmature|Idle");
    }
    if (id === user) {
      state.camera.position.x=group.current.position.x + 8;
     
      state.camera.position.z=group.current.position.z + 8;
      state.camera.lookAt(group.current.position);
    }

  })
  return (
    <group ref={group} {...props} position={position} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group name="CharacterArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Root} />
          </group>
          <group name="Casual_Body" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh name="Casual_Body_1" geometry={nodes.Casual_Body_1.geometry} material={materials.White} skeleton={nodes.Casual_Body_1.skeleton}>
              <meshStandardMaterial color={topColor} />
            </skinnedMesh>
            <skinnedMesh name="Casual_Body_2" geometry={nodes.Casual_Body_2.geometry} material={materials.Skin} skeleton={nodes.Casual_Body_2.skeleton} />
          </group>
          <group name="Casual_Feet" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh name="Casual_Feet_1" geometry={nodes.Casual_Feet_1.geometry} material={materials.Skin} skeleton={nodes.Casual_Feet_1.skeleton} />
            <skinnedMesh name="Casual_Feet_2" geometry={nodes.Casual_Feet_2.geometry} material={materials.Grey} skeleton={nodes.Casual_Feet_2.skeleton} >
              <meshStandardMaterial color={shoesColor} />
            </skinnedMesh>
          </group>
          <group name="Casual_Head" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh name="Casual_Head_1" geometry={nodes.Casual_Head_1.geometry} material={materials.Skin} skeleton={nodes.Casual_Head_1.skeleton} />
            <skinnedMesh name="Casual_Head_2" geometry={nodes.Casual_Head_2.geometry} material={materials.Hair_Blond} skeleton={nodes.Casual_Head_2.skeleton}>
              <meshStandardMaterial color={hairColor} />
            </skinnedMesh>
            <skinnedMesh name="Casual_Head_3" geometry={nodes.Casual_Head_3.geometry} material={materials.Hair_Brown} skeleton={nodes.Casual_Head_3.skeleton} />
            <skinnedMesh name="Casual_Head_4" geometry={nodes.Casual_Head_4.geometry} material={materials.Brown} skeleton={nodes.Casual_Head_4.skeleton} />
          </group>
          <skinnedMesh name="Casual_Legs" geometry={nodes.Casual_Legs.geometry} material={materials.Orange} skeleton={nodes.Casual_Legs.skeleton} rotation={[-Math.PI / 2, 0, 0]} scale={100} >
            <meshStandardMaterial color={bottomColor} />
          </skinnedMesh>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/AnimatedWoman.glb')
