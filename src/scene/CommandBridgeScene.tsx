import { useFrame } from "@react-three/fiber";
import { RoundedBox, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

type Props = { mode: "dark" | "light" };

function makeStars(count: number, spread: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * spread;
    positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.55;
    positions[i3 + 2] = -Math.random() * spread;
  }
  return positions;
}

export default function CommandBridgeScene({ mode }: Props) {
  const rig = useRef<THREE.Group>(null!);
  const stars = useMemo(() => makeStars(3200, 200), []);

  useFrame(({ camera, mouse }, dt) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.6, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.5 + mouse.y * 0.22, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.2, 0.02);
    camera.lookAt(0, 0.35, -7.5);

    if (rig.current) {
      rig.current.rotation.y += dt * 0.03;
      rig.current.rotation.x = Math.sin(Date.now() * 0.00025) * 0.02;
    }
  });

  const bg = mode === "dark" ? "#000005" : "#eef2ff";

  return (
    <group>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 18, 140]} />

      {/* outside */}
      <group position={[0, 0.3, -35]}>
        <Points positions={stars} stride={3} frustumCulled={false}>
          <PointMaterial transparent color={mode === "dark" ? "#ffffff" : "#111827"} size={0.013} sizeAttenuation depthWrite={false} opacity={0.7} />
        </Points>
        <mesh position={[2.6, 1.2, -30]}>
          <sphereGeometry args={[2.9, 40, 40]} />
          <meshBasicMaterial color={mode === "dark" ? "#dbeafe" : "#1d4ed8"} transparent opacity={0.06} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      <ambientLight intensity={mode === "dark" ? 0.28 : 0.7} />
      <directionalLight position={[4, 6, 2]} intensity={mode === "dark" ? 0.55 : 0.7} color={"#ffffff"} />
      <pointLight position={[0, 1.2, 1.0]} intensity={mode === "dark" ? 0.55 : 0.35} color={"#e5e7eb"} distance={25} />

      <group ref={rig} position={[0, 0.0, -10]}>
        {/* bridge shell */}
        <RoundedBox position={[0, 0.75, -4]} args={[7.6, 3.8, 16]} radius={0.28} smoothness={8}>
          <meshStandardMaterial color={mode === "dark" ? "#05070c" : "#e5e7eb"} roughness={0.9} metalness={0.08} />
        </RoundedBox>

        {/* forward panoramic window */}
        <RoundedBox position={[0, 1.05, -11.6]} args={[6.4, 2.2, 0.12]} radius={0.22} smoothness={8}>
          <meshStandardMaterial
            color={mode === "dark" ? "#070a10" : "#ffffff"}
            roughness={0.08}
            metalness={0.02}
            transparent
            opacity={mode === "dark" ? 0.16 : 0.14}
            emissive={mode === "dark" ? "#cbd5e1" : "#111827"}
            emissiveIntensity={mode === "dark" ? 0.35 : 0.08}
          />
        </RoundedBox>

        {/* command console */}
        <RoundedBox position={[0, -0.25, -7.5]} args={[5.8, 0.6, 2.1]} radius={0.18} smoothness={8}>
          <meshStandardMaterial color={mode === "dark" ? "#0b0f17" : "#cbd5e1"} roughness={0.7} metalness={0.25} />
        </RoundedBox>
        <RoundedBox position={[0, 0.35, -8.1]} args={[4.8, 0.9, 0.12]} radius={0.18} smoothness={8}>
          <meshStandardMaterial
            color={mode === "dark" ? "#05070c" : "#ffffff"}
            roughness={0.25}
            metalness={0.1}
            emissive={mode === "dark" ? "#e5e7eb" : "#111827"}
            emissiveIntensity={mode === "dark" ? 0.06 : 0.03}
            transparent
            opacity={mode === "dark" ? 0.55 : 0.2}
          />
        </RoundedBox>

        {/* subtle instrument lights */}
        {[-1.6, -0.8, 0.0, 0.8, 1.6].map((x, i) => (
          <mesh key={i} position={[x, 0.02, -6.75]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#fde68a" : "#e5e7eb"} transparent opacity={0.18} />
          </mesh>
        ))}

        {/* deck */}
        <mesh position={[0, -0.78, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.2, 18.0, 1, 1]} />
          <meshStandardMaterial color={mode === "dark" ? "#03040a" : "#f8fafc"} roughness={1} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}
