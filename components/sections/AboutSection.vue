<template>
  <section id="about" class="section about">
    <div class="container">
      <SectionTitle index="01" title="about me" />

      <div class="about__grid">
        <div v-reveal class="about__portrait-wrap">
          <div v-tilt="12" class="about__portrait">
            <div class="about__ring" aria-hidden="true" />
            <div class="about__disc" aria-hidden="true" />
            <div class="about__cutout">
              <img
                class="about__photo"
                src="/img/profile.webp"
                alt="Portrait of Reinaldo Rozato Junior"
                width="600"
                height="708"
              >
            </div>
            <span class="about__badge about__badge--1" aria-hidden="true">Go</span>
            <span class="about__badge about__badge--2" aria-hidden="true">Rust</span>
            <span class="about__badge about__badge--3" aria-hidden="true">TS</span>
            <div class="tilt-glare" />
          </div>
        </div>

        <TerminalWindow v-reveal="150" title="~/about — bio.md">
          <p class="about__cmd">
            <span class="about__prompt">$</span> <TypedText text="cat bio.md" :speed="70" @done="showBio = true" />
          </p>
          <div class="about__bio" :class="{ 'is-shown': showBio }">
            <p>
              I'm <strong>Reinaldo Rozato Junior</strong>, a software engineer based in São Paulo, Brazil, with more than four years of professional experience and a degree in Computer Science from UNIP.
            </p>
            <p>
              My core stack is <strong>Go, Rust and TypeScript</strong>, complemented by Python. I work across the stack: designing backend services built for performance and reliability, and the frontend interfaces that sit on top of them.
            </p>
            <p>
              I value code that is easy to read, test and maintain, and I put care into architectural decisions early so systems stay fast and simple to evolve as they grow.
            </p>
            <p>
              I'm open to new opportunities and collaborations. If you're building something where performance and quality matter, I'd be glad to talk.
            </p>
          </div>
        </TerminalWindow>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const showBio = ref(false)
</script>

<style scoped lang="scss">
.about__grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 56px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.about__portrait-wrap {
  display: flex;
  justify-content: center;
}

.about__portrait {
  position: relative;
  width: 260px;
  height: 260px;
  border-radius: 50%;
}

.about__ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: conic-gradient(from var(--angle), var(--accent), transparent 30%, var(--accent-cyan) 55%, transparent 80%, var(--accent));
  animation: spin-angle 6s linear infinite;
  filter: drop-shadow(0 0 18px rgba(var(--accent-rgb), 0.45));
  mask: radial-gradient(circle, transparent 62%, #000 63%);
  transform: translateZ(-20px);
}

// Backdrop circle; the transparent cutout photo sits on top of it
.about__disc {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid var(--bg);
  background:
    radial-gradient(circle at 50% 35%, rgba(var(--accent-rgb), 0.35), transparent 70%),
    linear-gradient(180deg, #1f2a27, #121615);
  transform: translateZ(10px);
}

// Rounded at the bottom like the circle but open at the top, so the head pops out of the frame
.about__cutout {
  position: absolute;
  left: 3px;
  right: 3px;
  bottom: 3px;
  height: 128%;
  overflow: hidden;
  border-radius: 0 0 127px 127px;
  transform: translateZ(30px);
}

.about__photo {
  position: absolute;
  left: 50%;
  bottom: -8%;
  width: 112%;
  max-width: none;
  height: auto;
  translate: -50% 0;
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.5));
}

.about__badge {
  position: absolute;
  padding: 4px 12px;
  font-size: 0.8rem;
  color: var(--heading);
  border-radius: 999px;
  background: rgba(24, 26, 27, 0.85);
  border: 1px solid rgba(var(--accent-rgb), 0.5);
  box-shadow: var(--glow);
  transform: translateZ(70px);
  animation: float 5s ease-in-out infinite;

  &--1 { top: 6%; right: -8%; }
  &--2 { bottom: 14%; right: -14%; animation-delay: -1.6s; }
  &--3 { bottom: 4%; left: -6%; animation-delay: -3.2s; }
}

.about__cmd {
  color: var(--text-dim);
  margin-bottom: 18px;
}

.about__prompt {
  color: var(--accent);
}

.about__bio p {
  font-size: 0.95rem;
}

.about__bio p:last-child {
  margin-bottom: 0;
}

html.motion .about__bio {
  p {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
  }

  &.is-shown p {
    opacity: 1;
    transform: none;

    @for $i from 1 through 4 {
      &:nth-child(#{$i}) {
        transition-delay: #{($i - 1) * 140}ms;
      }
    }
  }
}

@keyframes float {
  50% {
    translate: 0 -8px;
  }
}
</style>
