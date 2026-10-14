/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// UV coordinates matching card.glb geometry
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -42, 0],
  fov = 24,
  transparent = true,
  cardModel = 'assets/3d/card.glb',
  frontImage = 'assets/images/lanyard-card-front.webp',
  backImage = 'assets/images/lanyard-card-back.webp',
  lanyardImage = 'assets/images/lanyard-band.png',
  imageFit = 'cover',
  lanyardWidth = 3.2,
  eventSource = null,
  onReady = null
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 1024);
  const [inView, setInView] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: '100px 0px 100px 0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        eventSource={eventSource || containerRef}
        camera={{ position: isMobile ? [0, 0, 24] : position, fov: isMobile ? 26 : fov }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? (window.devicePixelRatio || 2) : 2, 2.0)]}
        gl={{
          alpha: transparent,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          if (typeof onReady === 'function') onReady();
        }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[5, 12, 10]} intensity={2.4} />
        <directionalLight position={[-6, 3, 6]} intensity={1.6} color="#38bdf8" />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            inView={inView}
            isMobile={isMobile}
            cardModel={cardModel}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
          />
        </Physics>
        <Environment blur={0.85}>
          <Lightformer
            intensity={1.5}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={2.2}
            color="#00f2fe"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={2.0}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3.5}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
          <Lightformer
            intensity={4.0}
            color="#38bdf8"
            position={[10, 2, 8]}
            rotation={[0, -Math.PI / 3, 0]}
            scale={[50, 20, 1]}
          />
          <Lightformer
            intensity={2.5}
            color="#ffffff"
            position={[0, 8, -5]}
            scale={[40, 40, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  inView = true,
  maxSpeed = 60,
  minSpeed = 10,
  isMobile = false,
  cardModel,
  frontImage,
  backImage,
  imageFit = 'cover',
  lanyardImage,
  lanyardWidth = 3.2
}) {
  const bandLeft = useRef(),
    bandRight = useRef(),
    bandLower = useRef(),
    buckleRef = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2.2, linearDamping: 2.2 };
  
  const { size, viewport, gl } = useThree();
  const dpr = gl ? gl.getPixelRatio() : 1;
  const lineResolution = useMemo(
    () => new THREE.Vector2(size.width * dpr, size.height * dpr),
    [size.width, size.height, dpr]
  );
  const anchorX = isMobile ? 0 : Math.min(Math.max(viewport.width * 0.23, 2.6), 3.4);
  const anchorY = viewport.height / 2 + 0.6;

  const { nodes, materials } = useGLTF(cardModel);
  const texture = useTexture(lanyardImage || BLANK_PIXEL);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Luxury PBR Hardware & Polymer Materials
  const tacticalPolymerMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#070b14',
        metalness: 0.04,
        roughness: 0.82,
        clearcoat: 0.15,
        clearcoatRoughness: 0.4,
        envMapIntensity: 0.8
      }),
    []
  );
  const chromeMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f8fafc',
        metalness: 1.0,
        roughness: 0.06,
        clearcoat: 0.4,
        clearcoatRoughness: 0.08,
        envMapIntensity: 3.6
      }),
    []
  );
  const ballisticCuffMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.95,
        roughness: 0.18,
        envMapIntensity: 2.6
      }),
    []
  );

  useEffect(() => () => {
    tacticalPolymerMat.dispose();
    chromeMat.dispose();
    ballisticCuffMat.dispose();
  }, [tacticalPolymerMat, chromeMat, ballisticCuffMat]);

  // High-Performance Power-of-Two (POT) Master Canvas Atlas (Prevents Downsampling while eliminating buffer stutter)
  const cardMap = useMemo(() => {
    try {
      const baseMap = materials?.base?.map;
      const baseImg = baseMap?.image;
      const W = isMobile ? 1024 : 2048;
      const H = isMobile ? 1024 : 2048;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return baseMap || null;

      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, W, H);
      if (baseImg && baseImg.width > 0 && baseImg.height > 0) {
        try { ctx.drawImage(baseImg, 0, 0, W, H); } catch (e) {}
      }

      const drawFitted = (img, rect) => {
        if (!img || !img.width || !img.height) return;
        const rx = rect.x * W;
        const ry = rect.y * H;
        const rw = rect.w * W;
        const rh = rect.h * H;
        const pick = imageFit === 'contain' ? Math.min : Math.max;
        const scale = pick(rw / img.width, rh / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = rx + (rw - dw) / 2;
        const dy = ry + (rh - dh) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
        ctx.clip();
        try { ctx.drawImage(img, dx, dy, dw, dh); } catch (e) {}
        ctx.restore();
      };

      if (frontTex?.image) drawFitted(frontTex.image, FRONT_UV_RECT);
      if (backTex?.image) drawFitted(backTex.image, BACK_UV_RECT);

      const composite = new THREE.CanvasTexture(canvas);
      composite.colorSpace = THREE.SRGBColorSpace;
      composite.flipY = false; // Guaranteed glTF top-left UV convention (renders badge 100% upright)
      composite.minFilter = THREE.LinearMipmapLinearFilter;
      composite.magFilter = THREE.LinearFilter;
      composite.generateMipmaps = true;
      composite.anisotropy = 16;
      composite.needsUpdate = true;
      return composite;
    } catch (err) {
      console.warn('[Lanyard] cardMap generation error:', err);
      return materials?.base?.map || null;
    }
  }, [frontTex, backTex, imageFit, materials?.base?.map, isMobile]);

  useEffect(() => () => {
    if (cardMap && typeof cardMap.dispose === 'function') cardMap.dispose();
  }, [cardMap]);

  // Dual V-Neck Neck Loop Curves + Lower Connector Ribbon Curve
  const [curveLeft] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [curveRight] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [curveLower] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  curveLeft.curveType = 'chordal';
  curveRight.curveType = 'chordal';
  curveLower.curveType = 'chordal';

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  // Top-Ceiling Physics Joint Chain (Natural ~75% V-Neck drape, ~25% lower connector)
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.45]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.50]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.85]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, isMobile ? 0.80 : 0.90, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  // Global window pointer release safety: guarantees drag release if cursor drops outside window
  useEffect(() => {
    if (!dragged) return;
    const handleGlobalRelease = () => {
      drag(false);
      document.body.style.userSelect = '';
      const wrapper = document.getElementById('hero-lanyard-wrapper');
      if (wrapper) wrapper.style.zIndex = '10';
    };
    window.addEventListener('pointerup', handleGlobalRelease);
    window.addEventListener('pointercancel', handleGlobalRelease);
    return () => {
      window.removeEventListener('pointerup', handleGlobalRelease);
      window.removeEventListener('pointercancel', handleGlobalRelease);
    };
  }, [dragged]);

  useFrame((state, delta) => {
    if (!inView) return;

    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());

      // Inelastic Webbing Clamping: Enforce physical woven webbing invariant (stops rubber-band pull)
      const targetX = vec.x - dragged.x;
      const targetY = vec.y - dragged.y;
      const targetZ = vec.z - dragged.z;
      const anchor = fixed.current?.translation() || { x: anchorX, y: anchorY, z: 0 };
      const dx = targetX - anchor.x;
      const dy = targetY - anchor.y;
      const dz = targetZ - anchor.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const maxLen = isMobile ? 5.2 : 5.8;
      let finalX = targetX;
      let finalY = targetY;
      let finalZ = targetZ;
      if (dist > maxLen && dist > 0.0001) {
        const factor = maxLen / dist;
        finalX = anchor.x + dx * factor;
        finalY = anchor.y + dy * factor;
        finalZ = anchor.z + dz * factor;
      }
      card.current?.setNextKinematicTranslation({ x: finalX, y: finalY, z: finalZ });
    }

    if (fixed.current && card.current && bandLeft.current && bandRight.current && bandLower.current) {
      [j1, j2].forEach(ref => {
        if (ref.current) {
          const trans = ref.current.translation();
          if (!trans || isNaN(trans.x) || isNaN(trans.y) || isNaN(trans.z)) return;
          if (!ref.current.lerped || isNaN(ref.current.lerped.x)) {
            ref.current.lerped = new THREE.Vector3(trans.x, trans.y, trans.z);
          }
          const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(trans)));
          const speed = minSpeed + clampedDistance * (maxSpeed - minSpeed);
          const factor = Math.min(1, Math.max(0, (delta || 0.016) * speed));
          ref.current.lerped.lerp(trans, factor);
        }
      });

      const j1L = j1.current?.lerped || new THREE.Vector3(anchorX, anchorY - 1.40, 0);
      const j2L = j2.current?.lerped || new THREE.Vector3(anchorX, anchorY - (isMobile ? 2.60 : 2.85), 0);

      // Exact World-Space Locking to Precision Metal Ferrule Clamp at Z = 1.074 (ZERO AIR GAP)
      const q = card.current.rotation();
      const quat = new THREE.Quaternion(q.x, q.y, q.z, q.w);
      const cTrans = card.current.translation();

      const scaleFactor = isMobile ? 2.5 : 3.1;
      const cuffLocalY = isMobile ? (1.074 * 2.5 - 1.35) : (1.074 * 3.1 - 1.65);
      const p0Center = new THREE.Vector3(0, cuffLocalY, 0.0034 * scaleFactor).applyQuaternion(quat).add(cTrans);

      // Orient Tactical Quick-Release Buckle along strap tension path
      const buckleQuat = new THREE.Quaternion();
      const dirDown = new THREE.Vector3().subVectors(p0Center, j2L).normalize();
      if (dirDown.lengthSq() > 0.001) {
        buckleQuat.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dirDown);
      }
      if (buckleRef.current) {
        buckleRef.current.position.copy(j2L);
        buckleRef.current.quaternion.copy(buckleQuat);
      }

      // Ceiling Anchors (Authentic V-Neck Drape)
      const drapeSpread = isMobile ? 0.45 : 0.68;
      const anchorLeft = new THREE.Vector3(anchorX - drapeSpread, anchorY + 0.15, 0);
      const anchorRight = new THREE.Vector3(anchorX + drapeSpread, anchorY + 0.15, 0);

      const j1Spread = drapeSpread * 0.55;
      const p1Left = new THREE.Vector3(j1L.x - j1Spread, j1L.y, j1L.z);
      const p1Right = new THREE.Vector3(j1L.x + j1Spread, j1L.y, j1L.z);

      // Buckle Top Entry Points (Left & Right top slots at Z = 0.078 in Blender CAD)
      const buckleTopLeft = new THREE.Vector3(-0.045, 0.078, 0).applyQuaternion(buckleQuat).add(j2L);
      const buckleTopRight = new THREE.Vector3(+0.045, 0.078, 0).applyQuaternion(buckleQuat).add(j2L);

      // Buckle Bottom Exit Point (Single bottom slot at Z = -0.078 in Blender CAD)
      const buckleBottom = new THREE.Vector3(0, -0.078, 0).applyQuaternion(buckleQuat).add(j2L);

      // Smooth intermediate point between buckle and hook cuff
      const pMid = new THREE.Vector3().lerpVectors(buckleBottom, p0Center, 0.5);

      // 1. Upper Left V-Neck Strap: anchorLeft -> p1Left -> buckleTopLeft
      curveLeft.points[0].copy(buckleTopLeft);
      curveLeft.points[1].copy(p1Left);
      curveLeft.points[2].copy(anchorLeft);

      // 2. Upper Right V-Neck Strap: anchorRight -> p1Right -> buckleTopRight
      curveRight.points[0].copy(buckleTopRight);
      curveRight.points[1].copy(p1Right);
      curveRight.points[2].copy(anchorRight);

      // 3. Lower Connector Ribbon: buckleBottom -> pMid -> p0Center (Sewn Cuff)
      curveLower.points[0].copy(p0Center);
      curveLower.points[1].copy(pMid);
      curveLower.points[2].copy(buckleBottom);

      const ptsCountUpper = isMobile ? 24 : 32;
      const ptsCountLower = isMobile ? 16 : 24;
      bandLeft.current.geometry.setPoints(curveLeft.getPoints(ptsCountUpper));
      bandRight.current.geometry.setPoints(curveRight.getPoints(ptsCountUpper));
      bandLower.current.geometry.setPoints(curveLower.getPoints(ptsCountLower));

      const cAng = card.current.angvel();
      const cRot = card.current.rotation();
      if (cAng && cRot && !isNaN(cAng.x) && !isNaN(cRot.y)) {
        ang.copy(cAng);
        rot.copy(cRot);
        const qy = cRot.w < 0 ? -cRot.y : cRot.y;
        // Tri-axial gentle restorative damping: stabilizes pitch, yaw, and roll so badge settles forward
        card.current.setAngvel({
          x: ang.x - (cRot.x || 0) * 0.14,
          y: ang.y - qy * 0.32,
          z: ang.z - (cRot.z || 0) * 0.14
        });
      }
    }
  });

  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
  }

  if (!nodes?.card) return null;

  return (
    <>
      {/* Physics Anchor dynamically anchored at top ceiling boundary */}
      <group position={[anchorX, anchorY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -1.40, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, isMobile ? -2.60 : -2.85, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, isMobile ? -3.40 : -3.65, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, isMobile ? -4.20 : -4.55, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[isMobile ? 0.95 : 1.25, isMobile ? 1.40 : 1.75, 0.04]} />
          <group
            scale={isMobile ? 2.5 : 3.1}
            position={[0, isMobile ? -1.35 : -1.65, 0]}
            onPointerOver={() => {
              hover(true);
            }}
            onPointerOut={() => {
              hover(false);
            }}
            onPointerUp={e => {
              try { e.target.releasePointerCapture(e.pointerId); } catch (err) {}
              drag(false);
              document.body.style.userSelect = '';
              const wrapper = document.getElementById('hero-lanyard-wrapper');
              if (wrapper) wrapper.style.zIndex = '10';
            }}
            onPointerDown={e => {
              try { e.target.setPointerCapture(e.pointerId); } catch (err) {}
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              document.body.style.userSelect = 'none';
              const wrapper = document.getElementById('hero-lanyard-wrapper');
              if (wrapper) wrapper.style.zIndex = '30';
            }}
          >
            {/* Executive Optical PMMA Acrylic Pass with Mirror Clearcoat */}
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap || materials?.base?.map}
                map-anisotropy={16}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                roughness={0.12}
                metalness={0.05}
                ior={1.492}
                reflectivity={0.70}
                specularColor="#ffffff"
              />
            </mesh>
            {/* CAD-Grade Blender CNC Swivel Snap Hook (nodes.clip) */}
            {nodes.clip?.geometry && (
              <mesh geometry={nodes.clip.geometry} material={chromeMat} />
            )}
            {/* CAD-Grade Blender Metal Crimp Ferrule (nodes.clamp) */}
            {nodes.clamp?.geometry && (
              <mesh geometry={nodes.clamp.geometry} material={ballisticCuffMat} />
            )}
          </group>
        </RigidBody>
      </group>

      {/* 3D Tactical Quick-Release Buckle at j2 convergence */}
      <group ref={buckleRef} position={[anchorX, anchorY - (isMobile ? 2.60 : 2.85), 0]}>
        {nodes.buckle?.geometry && (
          <mesh geometry={nodes.buckle.geometry} material={tacticalPolymerMat} />
        )}
      </group>

      {/* 1. Upper Left Woven V-Neck Strap (Ceiling to Buckle Top Left) */}
      <mesh ref={bandLeft} renderOrder={1}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={true}
          depthWrite={false}
          transparent={true}
          resolution={lineResolution}
          useMap
          map={texture}
          repeat={[-1.0, 1]}
          lineWidth={isMobile ? 0.62 : 0.78}
        />
      </mesh>

      {/* 2. Upper Right Woven V-Neck Strap (Ceiling to Buckle Top Right) */}
      <mesh ref={bandRight} renderOrder={1}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={true}
          depthWrite={false}
          transparent={true}
          resolution={lineResolution}
          useMap
          map={texture}
          repeat={[-1.0, 1]}
          lineWidth={isMobile ? 0.62 : 0.78}
        />
      </mesh>

      {/* 3. Lower Connector Ribbon (Buckle Bottom Exit to Hook D-Ring Cuff) */}
      <mesh ref={bandLower} renderOrder={1}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={true}
          depthWrite={false}
          transparent={true}
          resolution={lineResolution}
          useMap
          map={texture}
          repeat={[-1.0, 1]}
          lineWidth={isMobile ? 0.62 : 0.78}
        />
      </mesh>
    </>
  );
}
