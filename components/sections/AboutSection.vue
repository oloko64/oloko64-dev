<template>
  <section id="about" class="section about">
    <div class="container">
      <SectionTitle index="01" title="about me" />

      <div class="about__grid">
        <div v-reveal class="about__portrait-wrap">
          <div v-tilt="12" class="about__portrait">
            <div class="about__ring" aria-hidden="true" />
            <img
              class="about__photo"
              src="/img/profile_pic.jpg"
              alt="Profile Image"
              width="260"
              height="260"
            >
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
              My name is <strong>Reinaldo Rozato Junior</strong>, a Computer Science graduate from UNIP with over 4 years of hands-on experience in software engineering.
            </p>
            <p>
              I specialize in building scalable and efficient systems, with deep expertise in <strong>Go, Rust, and TypeScript</strong>, as well as Python. My technical background allows me to bridge the gap between robust backend architecture and dynamic frontend experiences.
            </p>
            <p>
              Throughout my journey, I've tackled diverse challenges that refined my ability to deliver high-quality code and solve complex architectural problems.
            </p>
            <p>
              Currently based in São Paulo, Brazil, I am always open to new challenges and meaningful collaborations. If you're looking for a partner to build high-performance solutions, let's connect.
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

.about__photo {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--bg);
  transform: translateZ(30px);
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
