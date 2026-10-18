<template>
  <TresPerspectiveCamera ref="camera" :position="[0, 0.4, 8]" :fov="50" />
  <TresFog attach="fog" :args="['#181a1b', 6, 28]" />
  <TresAmbientLight :intensity="0.5" />
  <TresPointLight :position="[4, 4, 4]" color="#00b188" :intensity="60" />
  <TresPointLight :position="[-4, -2, 3]" color="#22d3ee" :intensity="30" />

  <TresGroup ref="core" :position="[coreX, coreY, 0]">
    <TresMesh ref="shell">
      <TresIcosahedronGeometry :args="[1.75, 1]" />
      <TresMeshBasicMaterial color="#00b188" wireframe transparent :opacity="0.55" />
    </TresMesh>
    <TresMesh ref="inner">
      <TresIcosahedronGeometry :args="[1.05, 0]" />
      <TresMeshStandardMaterial
        color="#0b2b24"
        emissive="#00b188"
        :emissive-intensity="0.35"
        :metalness="0.4"
        :roughness="0.35"
        flat-shading
      />
    </TresMesh>
    <TresMesh ref="ringA" :rotation="[Math.PI / 2.4, 0, 0]">
      <TresTorusGeometry :args="[2.55, 0.012, 8, 180]" />
      <TresMeshBasicMaterial color="#2ff0bf" transparent :opacity="0.7" />
    </TresMesh>
    <TresMesh ref="ringB" :rotation="[0, Math.PI / 3, Math.PI / 5]">
      <TresTorusGeometry :args="[3, 0.008, 8, 180]" />
      <TresMeshBasicMaterial color="#22d3ee" transparent :opacity="0.45" />
    </TresMesh>
  </TresGroup>

  <TresPoints ref="stars" :geometry="starsGeometry">
    <TresPointsMaterial
      color="#5fe8c4"
      :size="0.035"
      size-attenuation
      transparent
      :opacity="0.8"
      :depth-write="false"
      :blending="AdditiveBlending"
    />
  </TresPoints>

  <primitive :object="grid" :position="[0, -2.8, 0]" />
</template>

<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, GridHelper, type Group, type LineBasicMaterial, type Mesh, type PerspectiveCamera, type Points } from 'three'

const props = defineProps<{ active: boolean }>()

const camera = useTemplateRef<PerspectiveCamera>('camera')
const core = useTemplateRef<Group>('core')
const shell = useTemplateRef<Mesh>('shell')
const inner = useTemplateRef<Mesh>('inner')
const ringA = useTemplateRef<Mesh>('ringA')
const ringB = useTemplateRef<Mesh>('ringB')
const stars = useTemplateRef<Points>('stars')

// Particle field distributed in a hollow sphere around the scene
const STAR_COUNT = 1600
const positions = new Float32Array(STAR_COUNT * 3)
for (let i = 0; i < STAR_COUNT; i++) {
  const radius = 5 + Math.random() * 14
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
  positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
  positions[i * 3 + 2] = radius * Math.cos(phi)
}
const starsGeometry = new BufferGeometry()
starsGeometry.setAttribute('position', new BufferAttribute(positions, 3))

// Synthwave-style floor; scrolling it by one cell per loop makes it look infinite
const grid = new GridHelper(80, 80, new Color('#00b188'), new Color('#00b188'))
const gridMaterial = grid.material as LineBasicMaterial
gridMaterial.transparent = true
gridMaterial.opacity = 0.22

const coreX = ref(2.6)
const coreY = ref(0.2)
const pointer = { x: 0, y: 0 }
let scroll = 0

const onResize = () => {
  const wide = window.innerWidth > 900
  coreX.value = wide ? 2.6 : 0
  coreY.value = wide ? 0.2 : 0.6
}
const onPointer = (e: PointerEvent) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1
}
const onScroll = () => {
  scroll = Math.min(window.scrollY / window.innerHeight, 1.5)
}

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onPointer)
  window.removeEventListener('scroll', onScroll)
  starsGeometry.dispose()
  grid.geometry.dispose()
  gridMaterial.dispose()
})

const { onBeforeRender, start, stop } = useLoop()

watch(() => props.active, isActive => (isActive ? start() : stop()))

onBeforeRender(({ delta, elapsed }) => {
  if (shell.value) {
    shell.value.rotation.y += delta * 0.15
    shell.value.rotation.x += delta * 0.05
  }
  if (inner.value) {
    inner.value.rotation.y -= delta * 0.3
    inner.value.rotation.z += delta * 0.12
    inner.value.scale.setScalar(1 + Math.sin(elapsed * 1.6) * 0.04)
  }
  if (ringA.value) ringA.value.rotation.z += delta * 0.35
  if (ringB.value) ringB.value.rotation.x += delta * 0.22
  if (core.value) {
    core.value.position.y = coreY.value + Math.sin(elapsed * 0.8) * 0.15
    core.value.rotation.y += (scroll * 1.4 - core.value.rotation.y) * 0.06
  }
  if (stars.value) stars.value.rotation.y = elapsed * 0.015 + scroll * 0.3
  grid.position.z = (elapsed * 0.6) % 1

  if (camera.value) {
    const cam = camera.value
    cam.position.x += (pointer.x * 0.9 - cam.position.x) * 0.04
    cam.position.y += (0.4 - pointer.y * 0.5 - cam.position.y) * 0.04
    cam.lookAt(0, 0, 0)
  }
})
</script>
