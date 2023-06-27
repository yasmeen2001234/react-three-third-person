import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, useBox } from "@react-three/cannon";
import { useFBX } from "@react-three/drei";
import ThirdPersonCharacterControls from "react-three-third-person";

const BASE_ANIMATIONS_PATH = "./models";

const animationPaths = {
  idle: `${BASE_ANIMATIONS_PATH}/Idle.fbx`,
  walk: `${BASE_ANIMATIONS_PATH}/Walking.fbx`,
  run: `${BASE_ANIMATIONS_PATH}/Running.fbx`,
  jump: `${BASE_ANIMATIONS_PATH}/Jumping_Up.fbx`,
  inAir: `${BASE_ANIMATIONS_PATH}/Falling_To_Landing.fbx`,
  backpedal: `${BASE_ANIMATIONS_PATH}/Walking_Backwards.fbx`,
  turnLeft: `${BASE_ANIMATIONS_PATH}/left_turn.fbx`,
  turnRight: `${BASE_ANIMATIONS_PATH}/right_turn.fbx`,
};

function ThirdPersonCharacter() {
  //const mannyObj = manny();
  const characterObj = useFBX(`${BASE_ANIMATIONS_PATH}/Player_alone.fbx`);
  characterObj.scale.setScalar(0.01);
  characterObj.rotation.set(-3.14, 0, -3.14);

  characterObj.position.set(0, -0.4, 0);

  return (
    <ThirdPersonCharacterControls
      cameraOptions={{
        yOffset: 1.6,
        minDistance: 0.6,
        maxDistance: 7,
        collisionFilterMask: 2,
      }}
      characterObj={characterObj}
      animationPaths={animationPaths}
    />
  );
}

function Lighting() {
  return (
    <>
      <hemisphereLight
        skyColor={0xffffff}
        groundColor={0x444444}
        position={[0, 0, 0]}
      />
      <directionalLight
        color={0xffffff}
        intensity={0.25}
        castShadow
        position={[0, 200, 100]}
      />
    </>
  );
}

function Floor() {
  const [ref] = useBox(() => ({
    type: "Static",
    args: [25, 0.2, 25],
    mass: 0,
    material: {
      friction: 0,
      name: "floor",
    },
    collisionFilterGroup: 2,
  }));
  return (
    <group>
      <mesh ref={ref}>
        <boxGeometry name="floor-box" />
        <meshPhongMaterial opacity={0} transparent color="black" />
      </mesh>
      <gridHelper args={[25, 25]} />
    </group>
  );
}

function Wall({ args, ...props }) {
  const [ref] = useBox(() => ({
    type: "Static",
    args,
    mass: 0,
    material: {
      friction: 0.3,
      name: "wall",
    },
    collisionFilterGroup: 2,
    ...props,
  }));
  return (
    <mesh receiveShadow ref={ref} {...props}>
      <boxGeometry args={args} />
      <meshPhongMaterial color="red" opacity={0.8} transparent />
    </mesh>
  );
}

function App() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas
        flat
        camera={{
          fov: 75,
          near: 0.1,
          far: 3800,
          position: [0, 11, 11],
        }}
      >
        <Physics gravity={[0, -35, 0]}>
          <Suspense fallback={null}>
            <ThirdPersonCharacter />
          </Suspense>
          <Wall args={[25, 3, 0.2]} position={[0, 1.4, -12.6]} />
          <Wall args={[25, 3, 0.2]} position={[0, 1.4, 12.6]} />
          <Wall
            args={[25, 3, 0.2]}
            rotation={[0, -Math.PI / 2, 0]}
            position={[12.6, 1.4, 0]}
          />
          <Wall
            args={[25, 3, 0.2]}
            rotation={[0, -Math.PI / 2, 0]}
            position={[-12.6, 1.4, 0]}
          />
          <Floor />
        </Physics>
        <Lighting />
      </Canvas>
  
    </div>
  );
}

export default App;
