import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(Boolean(media.matches))
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return reduced
}

function RotorIcon({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 7.2c2.1 0 3.6-1.06 3.6-2.2S14.1 2.8 12 2.8 8.4 3.86 8.4 5s1.5 2.2 3.6 2.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16.2 12c0 2.1 1.06 3.6 2.2 3.6s2.2-1.5 2.2-3.6-1.06-3.6-2.2-3.6-2.2 1.5-2.2 3.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 16.8c-2.1 0-3.6 1.06-3.6 2.2s1.5 2.2 3.6 2.2 3.6-1.06 3.6-2.2-1.5-2.2-3.6-2.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7.8 12c0-2.1-1.06-3.6-2.2-3.6S3.4 9.9 3.4 12s1.06 3.6 2.2 3.6S7.8 14.1 7.8 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 14.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  )
}

function SunMoonIcon({ mode }) {
  return mode === 'dark' ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.8A8.5 8.5 0 0 1 11.2 3a6.7 6.7 0 1 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M12 2v2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 19.6V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 12h2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.6 12H22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M4.4 4.4 6.1 6.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17.9 17.9 19.6 19.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19.6 4.4 17.9 6.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.1 17.9 4.4 19.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCameraWings() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 8.2h7l1.4 1.6H19a2 2 0 0 1 2 2v5.8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5.8a2 2 0 0 1 2-2h1.1l1.4-1.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 16.8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.2 12.2c-1.2-.1-2.2-.5-3-1.4 2.3-.6 3.6-1.2 4.6-2.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M20.8 12.2c1.2-.1 2.2-.5 3-1.4-2.3-.6-3.6-1.2-4.6-2.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconGlobe360() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.5 12h17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 3c2.6 2.9 4.1 6 4.1 9s-1.5 6.1-4.1 9c-2.6-2.9-4.1-6-4.1-9S9.4 5.9 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7.1 7.7c.9-.7 2.1-1.1 3.4-1.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M16.9 16.3c-.9.7-2.1 1.1-3.4 1.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconMapGrid() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 3 3 5.5V21l6-2.5 6 2.5 6-2.5V3l-6 2.5L9 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 3v15.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 5.5V21" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.2 10.2h1.8M6.2 13.2h1.8M16 10.2h1.8M16 13.2h1.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconLeafSpray() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 4c-7.5.4-12.5 5-12.5 11.2 0 2.6 1.7 4.8 4.4 4.8C18 20 20 13.6 20 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7.8 13.2c3.2.2 6.2-1 8.8-3.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4.2 16.2c0 1.1-1 1.7-1 2.6 0 .6.4 1 .9 1 .9 0 1.8-.8 1.8-2.2 0-.7-.3-1.3-.7-1.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6.9 16.8c0 1.1-1 1.7-1 2.6 0 .6.4 1 .9 1 .9 0 1.8-.8 1.8-2.2 0-.7-.3-1.3-.7-1.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconChartPlant() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 19V5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4 19h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 15l3-3 2 2 5-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21c0-4.5 2.4-7.2 7-8.2-1 4.6-3.7 7-7 8.2Z"
        fill="currentColor"
        opacity="0.14"
      />
    </svg>
  )
}

function IconBulbGear() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 21h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 2a7 7 0 0 0-4 12.7V16a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1.3A7 7 0 0 0 12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 10.9h-1.1l-.3-.8.8-.8-1.3-1.3-.8.8-.8-.3V6.4h-1.8v1.1l-.8.3-.8-.8-1.3 1.3.8.8-.3.8H11v1.8h1.1l.3.8-.8.8 1.3 1.3.8-.8.8.3v1.1h1.8v-1.1l.8-.3.8.8 1.3-1.3-.8-.8.3-.8h1.1v-1.8Z"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  )
}

function IconSocialInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M17.4 6.6h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconSocialFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 9h3V6h-3a4 4 0 0 0-4 4v3H7v3h3v6h3v-6h3l1-3h-4v-3a1 1 0 0 1 1-1Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  )
}

function IconSocialYouTube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.6 8.1a3 3 0 0 0-2.1-2.1C17.6 5.5 12 5.5 12 5.5s-5.6 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 3.9 3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-3.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10.2 9.6 15.2 12l-5 2.4V9.6Z" fill="currentColor" opacity="0.92" />
    </svg>
  )
}

function IconSocialLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 9.3V18H4.1V9.3h2.5ZM5.35 8.1a1.45 1.45 0 1 1 0-2.9 1.45 1.45 0 0 1 0 2.9Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M10 9.3h2.4v1.2c.4-.8 1.4-1.4 2.8-1.4 2.7 0 3.2 1.8 3.2 4.1V18h-2.5v-4.1c0-1 0-2.2-1.4-2.2s-1.6 1.1-1.6 2.2V18H10V9.3Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  )
}

function MiniDroneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 13.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M7 10.9h2.2M14.8 10.9H17M8.2 7.2l1.6 1.6M14.2 8.8l1.6-1.6M8.2 14.6l1.6-1.6M14.2 13l1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function buildProceduralHexacopter({ scale = 1 } = {}) {
  const group = new THREE.Group()
  const props = []

  const warmCream = new THREE.Color('#ffdfb5')
  const warmBrown = new THREE.Color('#644a40')
  const charcoal = new THREE.Color('#2a2a2a')

  const bodyMat = new THREE.MeshStandardMaterial({
    color: charcoal,
    roughness: 0.85,
    metalness: 0.08,
  })
  const accentMat = new THREE.MeshStandardMaterial({
    color: warmCream,
    roughness: 0.75,
    metalness: 0.06,
  })
  const armMat = new THREE.MeshStandardMaterial({
    color: warmBrown,
    roughness: 0.8,
    metalness: 0.1,
  })

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.75, 0.32, 8, 1, false),
    bodyMat,
  )
  body.castShadow = true
  body.receiveShadow = false
  body.position.y = 0.25
  group.add(body)

  const topPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.6, 0.08, 8, 1, false),
    accentMat,
  )
  topPlate.castShadow = true
  topPlate.position.y = 0.44
  group.add(topPlate)

  const tank = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.42, 6, 12), accentMat)
  tank.castShadow = true
  tank.position.set(0, 0.18, 0)
  tank.rotation.z = Math.PI / 2
  group.add(tank)

  const armGeo = new THREE.CylinderGeometry(0.055, 0.055, 1.35, 12)
  const motorGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.12, 14)
  const propGeo = new THREE.TorusGeometry(0.22, 0.03, 10, 24)
  const propMat = new THREE.MeshStandardMaterial({ color: charcoal, roughness: 0.7, metalness: 0.1 })

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const arm = new THREE.Mesh(armGeo, armMat)
    arm.castShadow = true
    arm.position.y = 0.3
    arm.rotation.z = Math.PI / 2
    arm.rotation.y = angle
    group.add(arm)

    const radius = 0.78
    const mx = Math.cos(angle) * radius
    const mz = Math.sin(angle) * radius

    const motor = new THREE.Mesh(motorGeo, bodyMat)
    motor.castShadow = true
    motor.position.set(mx, 0.38, mz)
    group.add(motor)

    const prop = new THREE.Mesh(propGeo, propMat)
    prop.castShadow = true
    prop.position.set(mx, 0.45, mz)
    prop.rotation.x = Math.PI / 2
    prop.userData.spinDir = i % 2 === 0 ? 1 : -1
    group.add(prop)
    props.push(prop)
  }

  const skidMat = new THREE.MeshStandardMaterial({ color: charcoal, roughness: 0.9, metalness: 0.05 })
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 10)
  const skidGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12)
  const legLeft = new THREE.Mesh(legGeo, skidMat)
  legLeft.castShadow = true
  legLeft.position.set(-0.32, 0.05, 0)
  group.add(legLeft)
  const legRight = new THREE.Mesh(legGeo, skidMat)
  legRight.castShadow = true
  legRight.position.set(0.32, 0.05, 0)
  group.add(legRight)

  const skid1 = new THREE.Mesh(skidGeo, skidMat)
  skid1.castShadow = true
  skid1.rotation.z = Math.PI / 2
  skid1.position.set(-0.32, -0.22, 0)
  group.add(skid1)
  const skid2 = new THREE.Mesh(skidGeo, skidMat)
  skid2.castShadow = true
  skid2.rotation.z = Math.PI / 2
  skid2.position.set(0.32, -0.22, 0)
  group.add(skid2)

  group.scale.setScalar(scale)
  group.userData.isProcedural = true
  group.userData.props = props
  return group
}

function DroneCanvas({ variant = 'hero', className, modelUrl, interactive = false, scale = 1 }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const isShowcase = variant === 'showcase'
    const interactiveMode = Boolean(interactive)
    const isMobile = window.matchMedia?.('(max-width: 980px)')?.matches
    const pixelRatioCap = isShowcase ? 1.5 : isMobile ? 1.1 : 1.25
    const targetFps = reducedMotion ? 24 : isShowcase ? 45 : 30
    const frameMs = 1000 / targetFps

    const scene = new THREE.Scene()
    // Black fog makes the hero look too dark in dark mode; keep fog only for showcase.
    scene.fog = isShowcase ? new THREE.Fog(new THREE.Color('#000000'), 18, 28) : null

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: isShowcase,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap))
    renderer.shadowMap.enabled = isShowcase
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(0.15, 1.12, variant === 'showcase' ? 2.4 : 1.35)
    camera.lookAt(0, 0.34, 0)

    const controls = interactiveMode
      ? new OrbitControls(camera, renderer.domElement)
      : null
    if (controls) {
      controls.enableDamping = true
      controls.dampingFactor = 0.06
      controls.enablePan = false
      controls.rotateSpeed = 0.85
      controls.zoomSpeed = 0.85
      controls.minDistance = 1.1
      controls.maxDistance = 6
      controls.target.set(0, 0.35, 0)
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_ROTATE,
      }
      renderer.domElement.style.touchAction = 'none'
      controls.update()
    }

    const root = new THREE.Group()
    scene.add(root)

    const warmLight = new THREE.Color('#ffdfb5')
    const ambient = new THREE.AmbientLight(warmLight, isShowcase ? 0.7 : 0.95)
    scene.add(ambient)

    if (!isShowcase) {
      const hemi = new THREE.HemisphereLight(
        new THREE.Color('#31548e'),
        new THREE.Color('#9b2828'),
        0.55,
      )
      scene.add(hemi)

      const rim = new THREE.DirectionalLight(new THREE.Color('#d9ecff'), 0.55)
      rim.position.set(-3.6, 2.2, -3.2)
      scene.add(rim)
    }

    const key = new THREE.DirectionalLight(warmLight, 1.25)
    key.position.set(3.2, 3.8, 2.8)
    key.castShadow = isShowcase
    key.shadow.mapSize.set(isShowcase ? 768 : 0, isShowcase ? 768 : 0)
    key.shadow.camera.near = 0.1
    key.shadow.camera.far = 15
    key.shadow.camera.left = -4
    key.shadow.camera.right = 4
    key.shadow.camera.top = 4
    key.shadow.camera.bottom = -4
    scene.add(key)

    const fill = new THREE.DirectionalLight(new THREE.Color('#ffffff'), 0.45)
    fill.position.set(-3.8, 1.6, 2.6)
    scene.add(fill)

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.ShadowMaterial({ opacity: isShowcase ? 0.22 : 0 }),
    )
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -0.45
    plane.receiveShadow = isShowcase
    scene.add(plane)

    // Loading placeholder (wireframe ring)
    const loaderGroup = new THREE.Group()
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.07, 10, 40),
      new THREE.MeshBasicMaterial({ color: 0x644a40, wireframe: true, transparent: true, opacity: 0.85 }),
    )
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.25
    loaderGroup.add(ring)
    root.add(loaderGroup)

    let drone = null
    let raf = 0
    let disposed = false
    let modelReady = false
    let running = false
    let visible = true
    let lastT = 0

    const pointer = { x: 0, y: 0 }
    const tilt = { x: 0, y: 0 }
    const targetTilt = { x: 0, y: 0 }

    const onMouseMove = (e) => {
      const r = container.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1
      const ny = ((e.clientY - r.top) / Math.max(1, r.height)) * 2 - 1
      pointer.x = clamp(nx, -1, 1)
      pointer.y = clamp(ny, -1, 1)
    }

    if (!interactiveMode) {
      container.addEventListener('mousemove', onMouseMove)
    }

    const setSize = () => {
      const width = Math.max(1, container.clientWidth)
      const height = Math.max(1, container.clientHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    setSize()

    const resizeObserver = new ResizeObserver(() => setSize())
    resizeObserver.observe(container)

    const fadeInDrone = () => {
      if (!drone) return

      const materialSet = new Set()
      drone.traverse((obj) => {
        if (!obj.isMesh) return
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          if (!m) return
          m.transparent = true
          m.opacity = 0
          materialSet.add(m)
        })
      })

      const mats = Array.from(materialSet)
      gsap.to(loaderGroup.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 0.4, ease: 'power2.out' })
      gsap.to(loaderGroup.children[0].material, { opacity: 0, duration: 0.35, ease: 'power2.out' })

      gsap.to(mats, {
        opacity: 1,
        duration: 0.85,
        ease: 'power2.out',
      })
      gsap.delayedCall(0.45, () => {
        if (!disposed) root.remove(loaderGroup)
      })
    }

    const adoptDrone = (group) => {
      drone = group
      drone.position.y = variant === 'showcase' ? 0 : 0.18
      drone.rotation.set(0, 0, 0)
      drone.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = isShowcase
          obj.receiveShadow = false
        }
      })
      if (variant === 'showcase') {
        drone.scale.setScalar(1.1)
        drone.rotation.x = -0.12
      } else {
        drone.scale.setScalar(3.1)
      }

      let finalScale = scale
      if (variant === 'hero' && isMobile) {
        // Adjust mobile scaling since it was fine before we bumped desktop scale
        finalScale = 0.8 // slightly bigger on mobile too, or keep 1
      }
      if (Number.isFinite(finalScale) && finalScale !== 1) {
        drone.scale.multiplyScalar(finalScale)
      }
      root.add(drone)
      modelReady = true
      fadeInDrone()
    }

    const tryLoadModel = async () => {
      const urls = [modelUrl].filter(Boolean)
      const gltfLoader = new GLTFLoader()

      for (const url of urls) {
        try {
          const gltf = await new Promise((resolve, reject) => {
            gltfLoader.load(url, resolve, undefined, reject)
          })
          const model = gltf.scene
          model.traverse((obj) => {
            if (obj.isMesh && obj.material) {
              obj.material.side = THREE.FrontSide
            }
          })
          adoptDrone(model)
          return
        } catch {
          // try next url
        }
      }

      adoptDrone(buildProceduralHexacopter({ scale: 1.2 }))
    }

    void tryLoadModel()

    const animate = (t) => {
      if (disposed) return
      if (!running) return

      if (t && lastT && t - lastT < frameMs) {
        raf = requestAnimationFrame(animate)
        return
      }
      lastT = t || performance.now()

      const maxDeg = 10
      const maxRad = THREE.MathUtils.degToRad(maxDeg)
      if (!interactiveMode) {
        targetTilt.x = -pointer.y * maxRad
        targetTilt.y = pointer.x * maxRad

        tilt.x = lerp(tilt.x, targetTilt.x, 0.08)
        tilt.y = lerp(tilt.y, targetTilt.y, 0.08)
      } else {
        tilt.x = lerp(tilt.x, 0, 0.12)
        tilt.y = lerp(tilt.y, 0, 0.12)
      }

      loaderGroup.rotation.y += 0.06
      ring.rotation.z += 0.05

      if (drone) {
        const auto = reducedMotion || interactiveMode ? 0 : 0.003
        drone.rotation.y += auto
        drone.rotation.x = lerp(drone.rotation.x, tilt.x, 0.08)
        drone.rotation.z = lerp(drone.rotation.z, tilt.y * 0.12, 0.08)
        drone.rotation.y += tilt.y * 0.01

        // spin propellers for procedural fallback
        if (modelReady && drone.userData?.isProcedural && Array.isArray(drone.userData?.props)) {
          drone.userData.props.forEach((p) => {
            p.rotation.z += 0.18 * (p.userData?.spinDir || 1)
          })
        }
      }

      controls?.update()

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }

    const start = () => {
      if (disposed || running) return
      running = true
      lastT = 0
      raf = requestAnimationFrame(animate)
    }

    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (visible) start()
    }

    document.addEventListener('visibilitychange', onVisibility)

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        visible = Boolean(entry?.isIntersecting)
        if (!visible) stop()
        else if (!document.hidden) start()
      },
      { root: null, rootMargin: '250px 0px 250px 0px', threshold: 0.01 },
    )
    io.observe(container)

    start()

    return () => {
      disposed = true
      if (!interactiveMode) container.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
      io.disconnect()
      resizeObserver.disconnect()
      cancelAnimationFrame(raf)
      controls?.dispose()
      renderer.dispose()
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.())
          else obj.material?.dispose?.()
        }
      })
    }
  }, [variant, reducedMotion, modelUrl, interactive, scale])

  return (
    <div ref={containerRef} className={className} data-interactive={interactive ? 'true' : 'false'}>
      <canvas ref={canvasRef} className="droneCanvas" aria-label="3D drone model" />
    </div>
  )
}

function ServiceDetailPage({ services }) {
  const { slug } = useParams()
  const navigate = useNavigate()

  const service = useMemo(() => services.find((s) => s.slug === slug), [services, slug])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [slug])

  if (!service) {
    return (
      <main className="page">
        <section className="section">
          <div className="container">
            <div className="sectionHead">
              <h1 className="sectionTitle">Service not found</h1>
              <p className="sectionLead">Please go back to Services.</p>
            </div>
            <button className="btn primary" type="button" onClick={() => navigate('/#services')}>
              Back to Services
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="serviceDetailTop">
            <button className="serviceBack" type="button" onClick={() => navigate('/#services')}>
              ← Back to Services
            </button>
            <h1 className="serviceDetailTitle">{service.title}</h1>
          </div>

          <div className="serviceDetailPanel">
            <div className="serviceDetailMedia" aria-hidden="true">
              <img className="serviceDetailLogo" src={service.iconSrc} alt="" />
            </div>
            <div className="serviceDetailBody">
              <p className="serviceDetailIntro">{service.intro}</p>
              <ul className="serviceDetailBullets">
                {service.highlights.map((h) => (
                  <li key={h} className="serviceDetailBullet">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {service.sections.map((sec) => (
            <div key={sec.heading} className="serviceDetailSection">
              <h2 className="serviceDetailH2">{sec.heading}</h2>
              {sec.paragraphs.map((p, idx) => (
                <p key={`${sec.heading}-${idx}`} className="serviceDetailP">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function App() {
  const [mode, setMode] = useState('light')
  const [navOpen, setNavOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Photography')
  const [formStatus, setFormStatus] = useState('idle')
  const [brandLogoOk, setBrandLogoOk] = useState(true)
  const reducedMotion = usePrefersReducedMotion()

  const heroTitle = useMemo(() => 'Elevating Perspectives. Powering Precision.', [])
  const heroWords = useMemo(() => heroTitle.split(' '), [heroTitle])

  const tabs = useMemo(
    () =>
      [
        {
          name: 'Photography',
          items: ['4K Camera', 'Stabilized Gimbal', '30min Flight Time'],
        },
        {
          name: 'Mapping',
          items: ['RTK GPS', 'Centimetre Accuracy', 'GeoTIFF Output'],
        },
        {
          name: 'Agriculture',
          items: ['10L Tank', '2 Acres/Charge', 'Intelligent Spraying'],
        },
      ],
    [],
  )

  const showcaseModelUrl = useMemo(() => {
    return activeTab === 'Agriculture' ? '/models/drone-hero.glb' : '/models/drone-showcase.glb'
  }, [activeTab])

  const showcaseModelScale = useMemo(() => {
    return activeTab === 'Agriculture' ? 7.55 : 1.25
  }, [activeTab])

  const services = useMemo(
    () =>
      [
        {
          slug: 'ready-to-fly-drones',
          title: 'Design, Manufacturing & Assembly of Ready to Fly Drones',
          iconSrc: '/logo/manufacturing.png',
          intro:
            'Custom-built drone platforms designed around your mission — from airframe selection to payload integration, tuning, and field-ready delivery.',
          highlights: ['Payload & sensor integration', 'Flight tuning & validation', 'Compliance-ready documentation'],
          sections: [
            {
              heading: 'Delivery Drones',
              paragraphs: [
                'Purpose-built platforms for logistics that prioritize stability, repeatable routes, and safe payload handling.',
              ],
            },
            {
              heading: 'Seed Dropping Drones',
              paragraphs: [
                'Mechanisms and flight patterns optimized for coverage, uniform dispersal, and efficient operation over large areas.',
              ],
            },
            {
              heading: 'Fire Extinguishing Drones',
              paragraphs: [
                'Configurations that support rapid response scenarios with controlled payload release and reliable flight characteristics.',
              ],
            },
          ],
        },
        {
          slug: 'lidar',
          title: 'LiDAR (Light Detection and Ranging Services)',
          iconSrc: '/logo/lidar.png',
          intro:
            'High-density point clouds for terrain, structures, and vegetation — ideal for accurate elevation models and complex environments.',
          highlights: ['Point cloud generation', 'DSM/DTM outputs', 'Vegetation & corridor mapping'],
          sections: [
            {
              heading: 'LiDAR Application in Industries',
              paragraphs: [
                'LiDAR helps capture detailed 3D measurements even when visuals are challenging, supporting engineering, utilities, and infrastructure planning.',
              ],
            },
            {
              heading: 'LiDAR in Agricultural Drones',
              paragraphs: [
                'Use LiDAR for field mapping, obstacle detection, land leveling insights, and better farm planning through accurate elevation data.',
              ],
            },
          ],
        },
        {
          slug: 'uav-imagery-processing',
          title: 'Cutting Edge UAV Imagery Processing',
          iconSrc: '/logo/processing.png',
          intro:
            'From raw drone captures to clean deliverables — we process imagery into maps, models, and visuals that are ready for decision-making.',
          highlights: ['Orthomosaic & DSM creation', '3D models & meshes', 'Quality checks & exports'],
          sections: [
            {
              heading: 'Introduction to UAVs in Search and Rescue',
              paragraphs: [
                'Processed aerial imagery can improve situational awareness by providing fast area coverage and clear updates for teams on the ground.',
              ],
            },
          ],
        },
        {
          slug: 'land-survey',
          title: 'Extremely Accurate Land Survey Services',
          iconSrc: '/logo/survey.png',
          intro:
            'Accurate mapping and surveying outputs designed for planning, engineering workflows, and GIS/CAD usage — delivered fast.',
          highlights: ['Orthomosaic maps', 'Contours & surface models', 'CAD/GIS friendly formats'],
          sections: [
            {
              heading: 'Orthomosaic',
              paragraphs: [
                'High-resolution stitched maps with consistent scale for measurement, planning, and progress tracking.',
              ],
            },
            {
              heading: 'CAD Drawing',
              paragraphs: [
                'Survey outputs prepared for CAD workflows so teams can move from mapping to engineering design quickly.',
              ],
            },
            {
              heading: 'KML (Keyhole Markup Language)',
              paragraphs: [
                'Shareable geospatial layers to view boundaries and features inside common map tools.',
              ],
            },
            {
              heading: 'DSM / DTM',
              paragraphs: [
                'Surface models for analysis, earthwork estimates, drainage understanding, and site planning.',
              ],
            },
            {
              heading: '3D Point Cloud',
              paragraphs: [
                'Dense point clouds for precise 3D measurement and modeling applications.',
              ],
            },
          ],
        },
        {
          slug: 'photogrammetry',
          title: 'Industry Leading Photogrammetric Services',
          iconSrc: '/logo/photogrammetry.png',
          intro:
            'Photogrammetry transforms overlapping images into accurate 2D and 3D outputs — ideal for mapping, inspection, and documentation.',
          highlights: ['3D reconstruction', 'High-detail mapping', 'Repeatable survey workflows'],
          sections: [
            {
              heading: 'How does Drone Photogrammetry Work?',
              paragraphs: [
                'We capture overlapping images from multiple angles, then process them to generate maps and 3D representations that can be measured and analyzed.',
              ],
            },
            {
              heading: 'Benefits of Drone Photogrammetry',
              paragraphs: [
                'Faster data capture, safer access to hard-to-reach sites, and consistent outputs for progress and planning.',
              ],
            },
            {
              heading: 'Agricultural Benefits',
              paragraphs: [
                'Use photogrammetry to understand field conditions, observe crop patterns, and support farm planning with repeatable datasets.',
              ],
            },
          ],
        },
        {
          slug: 'architectural',
          title: 'Advanced Architectural Service',
          iconSrc: '/logo/architecture.png',
          intro:
            'Site documentation and aerial data for construction and architecture — faster inspection, better visibility, and clearer project decisions.',
          highlights: ['Site progress documentation', 'Inspection-friendly visuals', 'Planning & coordination support'],
          sections: [
            {
              heading: 'Benefits of Drones in Architectural Service',
              paragraphs: [
                'Reduce manual inspection risk, speed up documentation, and share clear visuals across stakeholders.',
              ],
            },
            {
              heading: 'Cost-effectiveness and Time Efficiency',
              paragraphs: [
                'Capture more coverage in fewer site visits, with consistent outputs that support quicker approvals and planning.',
              ],
            },
            {
              heading: 'Uses in Disaster Recovery and Reconstruction',
              paragraphs: [
                'Rapid aerial assessment and mapping help teams understand damage and plan safer recovery work.',
              ],
            },
          ],
        },
        {
          slug: 'gis',
          title: 'Geographic Information System',
          iconSrc: '/logo/gis.png',
          intro:
            'GIS-ready deliverables that make drone data easy to analyze, layer, and share across teams and tools.',
          highlights: ['Layered geospatial data', 'Analysis-ready mapping', 'Clear visualization for stakeholders'],
          sections: [
            {
              heading: 'Functionality of GIS Mapping Using Drones',
              paragraphs: [
                'Drone captures can be transformed into GIS layers for measurement, monitoring, and planning across projects.',
              ],
            },
            {
              heading: 'Applications and Benefits',
              paragraphs: [
                'Support time-sensitive decisions with updated maps and consistent geospatial datasets.',
              ],
            },
            {
              heading: 'Usefulness in Agriculture',
              paragraphs: [
                'Track field changes, monitor crop conditions, and support farm management with location-based insights.',
              ],
            },
          ],
        },
        {
          slug: 'crop-health',
          title: 'Crop Health Analysis',
          iconSrc: '/logo/crop-health.png',
          intro:
            'Crop health insights using aerial data — highlight stress areas early, monitor change over time, and support targeted interventions.',
          highlights: ['Early stress detection', 'Repeatable monitoring', 'Actionable field insights'],
          sections: [
            {
              heading: 'Why Multispectral Sensors Matter',
              paragraphs: [
                'Multispectral data can highlight changes that aren’t visible to the naked eye, helping identify issues sooner.',
              ],
            },
            {
              heading: 'Comprehensive Monitoring Parameters',
              paragraphs: [
                'We help monitor patterns like crop vigor, uniformity, and areas that may need targeted treatment.',
              ],
            },
            {
              heading: 'Irrigation Status',
              paragraphs: [
                'Identify zones that may require irrigation adjustment through consistent observation over time.',
              ],
            },
            {
              heading: 'Advanced Analytics',
              paragraphs: [
                'Export-ready outputs that can plug into dashboards and reporting workflows for farm decision-making.',
              ],
            },
          ],
        },
      ],
    [],
  )

  const testimonials = useMemo(
    () =>
      [
        {
          quote:
            "Aeromat's survey data was incredibly accurate — saved us weeks of manual measurement on our construction site.",
          who: 'Rajesh Mehta',
          where: 'Site Engineer, Pune',
        },
        {
          quote:
            'Their aerial footage for our real estate project was cinematic quality. Bookings increased 40% after using their visuals.',
          who: 'Priya Kapoor',
          where: 'Real Estate Developer',
        },
        {
          quote:
            'The agriculture drone spraying service covered 50 acres in a single day. Absolutely transformed how we manage our farm.',
          who: 'Vikram Patil',
          where: 'Farmer, Nashik',
        },
      ],
    [],
  )

  const clients = useMemo(
    () =>
      [
        'Maharashtra Van Vibhag',
        'GarudaUAV',
        'Maharashtra Police',
        'Jio',
        'UPL',
        'Mahindra',
        'Garuda Aerospace',
        'GAAR',
      ],
    [],
  )

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Support /#anchor deep-links even with the router.
    if (location.pathname !== '/') return
    if (!location.hash) return
    const id = location.hash
    const el = document.querySelector(id)
    if (!el) return
    // Let layout settle.
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.pathname, location.hash])

  const industries = useMemo(
    () =>
      [
        'Real Estate & Construction',
        'Agriculture & Farming',
        'Film & Media Production',
        'Mining & Quarrying',
        'Events & Weddings',
        'Infrastructure & Utilities',
        'Urban Planning & Smart Cities',
        'Solar Farm Inspections',
      ],
    [],
  )

  const tabPanelRef = useRef(null)
  const successDroneRef = useRef(null)
  const heroDroneRef = useRef(null)

  useEffect(() => {
    const stored = window.localStorage.getItem('aeromat-mode')
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    const initial = stored ?? (prefersDark ? 'dark' : 'light')
    setMode(initial)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
    window.localStorage.setItem('aeromat-mode', mode)
  }, [mode])

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.heroWord',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.07,
          delay: 0.15,
        },
      )

      gsap.utils.toArray('[data-animate="title"]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          },
        )
      })

      gsap.utils.toArray('[data-animate="service-card"]').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          },
        )
      })

      gsap.utils.toArray('[data-animate="industry"]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: i * 0.05,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
            },
          },
        )
      })

      gsap.fromTo(
        '.clientsLine',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.out',
          transformOrigin: '0% 50%',
          scrollTrigger: {
            trigger: '#survey',
            start: 'top 75%',
          },
        },
      )

      const statEls = gsap.utils.toArray('[data-count-to]')
      statEls.forEach((el) => {
        const to = Number(el.getAttribute('data-count-to') || '0')
        const prefix = el.getAttribute('data-count-prefix') || ''
        const suffix = el.getAttribute('data-count-suffix') || ''
        const obj = { value: 0 }

        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              value: to,
              duration: 1.4,
              ease: 'power2.out',
              onUpdate: () => {
                const v = Math.round(obj.value)
                el.textContent = `${prefix}${v}${suffix}`
              },
            })
          },
        })
      })

    })

    return () => ctx.revert()
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (!tabPanelRef.current) return
    if (reducedMotion) return

    gsap.fromTo(
      tabPanelRef.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
    )
  }, [activeTab, reducedMotion])

  useEffect(() => {
    if (formStatus !== 'success') return
    if (!successDroneRef.current) return

    const el = successDroneRef.current
    gsap.killTweensOf(el)

    const tl = gsap.timeline()
    const startX = -140
    const endX = window.innerWidth + 140
    tl.set(el, { opacity: 1, x: startX, y: 0, rotate: -6 })
      .to(el, {
        x: endX,
        duration: 1.6,
        ease: 'power2.inOut',
      })
      .to(
        el,
        {
          y: -18,
          duration: 0.4,
          yoyo: true,
          repeat: 3,
          ease: 'sine.inOut',
        },
        0,
      )
      .to(el, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 1.45)

    return () => {
      tl.kill()
    }
  }, [formStatus])

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate(`/${id}`)
      setNavOpen(false)
      return
    }
    const el = document.querySelector(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setNavOpen(false)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const phone = String(data.get('phone') || '').trim()
    if (!phone) {
      setFormStatus('error')
      return
    }
    setFormStatus('success')
    form.reset()
    setTimeout(() => setFormStatus('idle'), 3500)
  }

  return (
    <div className="page">
      <header className="navbar" role="banner">
        <div className="container navInner">
          <button
            className="logo"
            type="button"
            onClick={() => scrollTo('#top')}
            aria-label="Aeromat home"
          >
            <span className="logoMark" aria-hidden="true">
              {brandLogoOk ? (
                <img
                  className="brandImg"
                  src="/brand-logo.png"
                  alt=""
                  loading="eager"
                  onError={() => setBrandLogoOk(false)}
                />
              ) : (
                <RotorIcon className="rotor" />
              )}
            </span>
            <span className="logoText">AEROMAT</span>
          </button>

          <nav className={`navLinks ${navOpen ? 'open' : ''}`} aria-label="Primary">
            <button className="navLink" type="button" onClick={() => scrollTo('#services')}>
              Services
            </button>
            <button className="navLink" type="button" onClick={() => scrollTo('#industries')}>
              Industries
            </button>
            <button className="navLink" type="button" onClick={() => scrollTo('#survey')}>
              Survey
            </button>
            <button className="navLink" type="button" onClick={() => scrollTo('#about')}>
              About
            </button>
            <button className="navLink" type="button" onClick={() => scrollTo('#contact')}>
              Contact
            </button>
          </nav>

          <div className="navActions">
            <button
              className="iconBtn"
              type="button"
              aria-label="Toggle dark mode"
              onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
            >
              <SunMoonIcon mode={mode} />
            </button>

            <button className="ctaPill" type="button" onClick={() => scrollTo('#contact')}>
              Get a Free Quote
            </button>

            <button
              className={`hamburger ${navOpen ? 'open' : ''}`}
              type="button"
              aria-label="Open menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <main id="top">
              <section className="hero" aria-label="Hero">
          <div className="heroBg" aria-hidden="true" />
          <div className="container heroInner">
            <div className="heroDroneBg" ref={heroDroneRef} aria-label="3D drone background">
              <DroneCanvas className="droneWrap" variant="hero" modelUrl="/models/drone-hero.glb" scale={1.3} />
              <div className="droneShadow" aria-hidden="true" />
            </div>

            <div className="heroLeft">
              <h1 className="heroTitle">
                {heroWords.map((w, idx) => (
                  <span className="heroWord" key={`${w}-${idx}`}>
                    {w}{' '}
                  </span>
                ))}
              </h1>
              <p className="heroSub">
                Professional drone services for photography,<br/>
                mapping, agriculture & surveys across Pune and Maharashtra.
              </p>

              <div className="heroCtas">
                <button className="btn primary" type="button" onClick={() => scrollTo('#contact')}>
                  Request a Quote
                </button>
                <button className="btn outline" type="button" onClick={() => scrollTo('#services')}>
                  View Services
                </button>
              </div>

              <div className="trustRow" aria-label="Trust signals">
                <div className="trustPill">300+ Projects</div>
                <div className="trustPill">DGCA Compliant</div>
                <div className="trustPill">Pune-Based</div>
              </div>
            </div>
          </div>
        </section>

            <section id="services" className="section">
          <div className="container">
            <div className="servicesHead" aria-label="Our services">
              <h2 className="servicesTitle" data-animate="title">
                OUR SERVICES
              </h2>
              <div className="servicesUnderline" aria-hidden="true" />
            </div>

                <div className="servicesGrid">
                  {services.map((s) => (
                    <Link key={s.slug} to={`/services/${s.slug}`} className="serviceTile" data-animate="service-card">
                      <img className="serviceLogo" src={s.iconSrc} alt="" loading="lazy" />
                      <h3 className="serviceTileTitle">{s.title}</h3>
                    </Link>
                  ))}
                </div>
          </div>
              </section>

        <section id="industries" className="section alt">
          <div className="grain" aria-hidden="true" />
          <div className="container">
            <div className="sectionHead">
              <h2 className="sectionTitle" data-animate="title">
                Industries We Serve
              </h2>
              <p className="sectionLead">Aerial intelligence for industries that build, grow, and move.</p>
            </div>

            <div className="industriesGrid">
              {industries.map((name) => (
                <div className="industryTile" key={name} data-animate="industry">
                  <div className="industryDot" aria-hidden="true" />
                  <div className="industryName">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="survey" className="section">
          <div className="container">
            <div className="sectionHead">
              <h2 className="sectionTitle" data-animate="title">
                OUR CLIENTS
              </h2>
              <div className="clientsAccent" aria-hidden="true" />
              <p className="sectionLead">
                Making our clients happy with innovative drone solutions for surveillance, agriculture and consumer needs
              </p>
            </div>

            <div className="clients" aria-label="Clients">
              <div className="clientsLine" aria-hidden="true" />
              <div className="clientsMarquee" aria-label="Clients marquee">
                <div className="clientsTrack">
                  <div className="clientsGroup">
                    {clients.map((name, idx) => (
                      <div key={name} className="clientPill" style={{ '--i': idx }}>
                        {name}
                      </div>
                    ))}
                  </div>
                  <div className="clientsGroup" aria-hidden="true">
                    {clients.map((name, idx) => (
                      <div key={`dup-${name}`} className="clientPill" style={{ '--i': idx + clients.length }}>
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="container statsInner">
            <div className="stat">
              <div className="statNum" data-count-to="300" data-count-suffix="+">
                0+
              </div>
              <div className="statLabel">Projects Completed</div>
            </div>
            <div className="statSep" aria-hidden="true" />
            <div className="stat">
              <div className="statNum" data-count-to="5" data-count-suffix="+">
                0+
              </div>
              <div className="statLabel">Years Experience</div>
            </div>
            <div className="statSep" aria-hidden="true" />
            <div className="stat">
              <div className="statNum" data-count-to="10" data-count-suffix="+">
                0+
              </div>
              <div className="statLabel">Industries Served</div>
            </div>
            <div className="statSep" aria-hidden="true" />
            <div className="stat">
              <div className="statNum" data-count-to="100" data-count-suffix="%">
                0%
              </div>
              <div className="statLabel">DGCA Compliant</div>
            </div>
          </div>
        </section>

        <section className="section" aria-label="Drone showcase">
          <div className="container">
            <div className="sectionHead">
              <h2 className="sectionTitle" data-animate="title">
                Drone Showcase
              </h2>
              <p className="sectionLead">Interactive view + quick capability tabs for common missions.</p>
            </div>

            <div className="showcase">
              <div className="showcaseLeft">
                <div className="droneFrame big">
                  <DroneCanvas
                    className="droneWrap"
                    variant="showcase"
                    modelUrl={showcaseModelUrl}
                    interactive
                    scale={showcaseModelScale}
                  />
                  <div className="droneShadow" aria-hidden="true" />
                </div>
              </div>

              <div className="showcaseRight">
                <div className="tabs" role="tablist" aria-label="Drone specs">
                  {tabs.map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      className={`tab ${activeTab === t.name ? 'active' : ''}`}
                      role="tab"
                      aria-selected={activeTab === t.name}
                      onClick={() => setActiveTab(t.name)}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>

                <div className="tabPanel" ref={tabPanelRef} role="tabpanel">
                  <h3 className="tabTitle">{activeTab}</h3>
                  <ul className="tabList">
                    {tabs
                      .find((t) => t.name === activeTab)
                      ?.items.map((item) => (
                        <li key={item} className="tabItem">
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-label="Testimonials">
          <div className="container">
            <div className="sectionHead">
              <h2 className="sectionTitle" data-animate="title">
                Testimonials
              </h2>
              <p className="sectionLead">What clients say after we deliver.</p>
            </div>

            <div className="carousel" aria-label="Testimonials carousel">
              <div className="carouselTrack">
                <div className="carouselGroup">
                  {testimonials.map((t) => (
                    <article key={t.who} className="card testimonial">
                      <div className="stars">★★★★★</div>
                      <p className="quote">“{t.quote}”</p>
                      <div className="who">{t.who}</div>
                      <div className="where">{t.where}</div>
                    </article>
                  ))}
                </div>
                <div className="carouselGroup" aria-hidden="true">
                  {testimonials.map((t) => (
                    <article key={`dup-${t.who}`} className="card testimonial">
                      <div className="stars">★★★★★</div>
                      <p className="quote">“{t.quote}”</p>
                      <div className="who">{t.who}</div>
                      <div className="where">{t.where}</div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="lead" aria-label="Request a quote">
          <div className="container leadInner">
            <div className="leadCopy">
              <h2 className="leadTitle" data-animate="title">
                Ready to See Your World from Above?
              </h2>
              <p className="leadSub">Get a free consultation and custom quote for your project.</p>

              <div className="leadNote">
                Pune-based team • Fast turnaround • DGCA-compliant operations
              </div>
            </div>

            <div className="leadFormWrap">
              <form className="leadForm" onSubmit={onSubmit}>
                <div className="field">
                  <input name="name" type="text" placeholder=" " autoComplete="name" />
                  <label>Name</label>
                </div>

                <div className="field">
                  <input name="phone" type="tel" placeholder=" " required autoComplete="tel" />
                  <label>Phone Number *</label>
                </div>

                <div className="field">
                  <input name="email" type="email" placeholder=" " autoComplete="email" />
                  <label>Email</label>
                </div>

                <div className="field">
                  <select name="service" defaultValue="" required={false}>
                    <option value="" disabled>
                      Select service
                    </option>
                    <option>Aerial Photography</option>
                    <option>360 Panorama</option>
                    <option>Drone Mapping</option>
                    <option>Agriculture Spraying</option>
                    <option>Crop Monitoring</option>
                    <option>Consultancy</option>
                    <option>Other</option>
                  </select>
                  <label>Service Needed</label>
                </div>

                <div className="field">
                  <input name="location" type="text" placeholder=" " />
                  <label>Project Location</label>
                </div>

                <div className="field span2">
                  <textarea name="description" placeholder=" " rows={4} />
                  <label>Brief Description</label>
                </div>

                <button className="btn primary span2" type="submit">
                  Request Free Quote
                </button>

                {formStatus === 'error' ? (
                  <div className="formMsg error">Please enter a valid phone number.</div>
                ) : null}
                {formStatus === 'success' ? (
                  <div className="formMsg success">Thanks — we’ll get back to you shortly!</div>
                ) : null}
              </form>

              <div className="successDrone" ref={successDroneRef} aria-hidden="true">
                <span className="successDroneInner">
                  <MiniDroneIcon />
                </span>
                <span className="successDroneLabel">drone</span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="footer" aria-label="Footer">
          <div className="container footerInner">
            <div className="footerCol">
              <div className="footerLogo">
                  <span className="footerLogoMark" aria-hidden="true">
                    {brandLogoOk ? (
                      <img
                        className="brandImg"
                        src="/brand-logo.png"
                        alt=""
                        loading="lazy"
                        onError={() => setBrandLogoOk(false)}
                      />
                    ) : (
                      <RotorIcon className="rotor" />
                    )}
                  </span>
                <span className="footerLogoText">AEROMAT</span>
              </div>
              <p className="footerTag">Elevating perspectives across Pune & Maharashtra.</p>
              <div className="socialRow" aria-label="Social links">
                <a className="social" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <IconSocialInstagram />
                </a>
                <a className="social" href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <IconSocialFacebook />
                </a>
                <a className="social" href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <IconSocialYouTube />
                </a>
                <a className="social" href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <IconSocialLinkedIn />
                </a>
              </div>
            </div>

            <div className="footerCol">
              <div className="footerHead">Quick Links</div>
              <button className="footerLink" type="button" onClick={() => scrollTo('#services')}>
                Services
              </button>
              <button className="footerLink" type="button" onClick={() => scrollTo('#industries')}>
                Industries
              </button>
              <button className="footerLink" type="button" onClick={() => scrollTo('#survey')}>
                Survey
              </button>
              <button className="footerLink" type="button" onClick={() => scrollTo('#about')}>
                About
              </button>
              <button className="footerLink" type="button" onClick={() => scrollTo('#contact')}>
                Contact
              </button>
            </div>

            <div className="footerCol">
              <div className="footerHead">Contact</div>
              <div className="footerLine">📍 Pune, Maharashtra, India</div>
              <div className="footerLine">📞 +91 78410 01111</div>
              <div className="footerLine">✉️ aeromatcl@gmail.com</div>
              <div className="footerLine">🌐 aeromat.in</div>
            </div>
          </div>

          <div className="footerBar">
            <div className="container footerBarInner">
              <div>© 2025 Aeromat Creative Labs Pvt. Ltd. | All Rights Reserved | DGCA Compliant Drone Operator</div>
            </div>
          </div>
        </section>
            </main>
          }
        />
        <Route path="/services/:slug" element={<ServiceDetailPage services={services} />} />
      </Routes>
    </div>
  )
}

export default App
