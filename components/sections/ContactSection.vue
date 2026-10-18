<template>
  <section id="contact" class="section contact">
    <div class="container">
      <SectionTitle index="04" title="contact information" />

      <div class="contact__grid">
        <div v-reveal class="contact__intro">
          <h3 class="contact__headline">
            Let's build something <span class="contact__accent">high-performance</span>.
          </h3>
          <p class="contact__text">
            Find me on any of these channels, or drop a message straight into my inbox.
          </p>
          <ul class="contact__links">
            <li v-for="(icon, i) in icons" :key="icon.name" v-reveal="100 + i * 70">
              <a
                v-magnetic="6"
                class="contact__link"
                target="_blank"
                rel="noopener"
                :href="icon.link"
                :aria-label="icon.name"
              >
                <img
                  class="contact__icon"
                  :src="`/img/icons/${icon.name}.png`"
                  :alt="icon.alt"
                  width="22"
                  height="22"
                >
                <span class="contact__link-label">{{ icon.name }}</span>
              </a>
            </li>
          </ul>
        </div>

        <TerminalWindow v-reveal="150" title="~/contact — send-message.sh">
          <ContactForm />
        </TerminalWindow>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Icon {
  name: string;
  link: string;
  alt: string;
}
const icons: Icon[] = [
  {
    name: 'github',
    alt: 'github',
    link: 'https://github.com/oloko64'
  },
  {
    name: 'telegram',
    alt: 'telegram',
    link: 'https://t.me/5516997226813'
  },
  {
    name: 'whatsapp',
    alt: 'whatsapp',
    link: 'https://wa.me/qr/B5FIPTNB2QW2I1'
  },
  {
    name: 'linkedin',
    alt: 'linkedin',
    link: 'https://www.linkedin.com/in/reinaldo-rozato-junior-309ba319a/'
  },
  {
    name: 'email',
    alt: 'email',
    link: 'mailto:reinaldorozatoj.11cg1@aleeas.com'
  }
]
</script>

<style scoped lang="scss">
.contact__grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 56px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.contact__headline {
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  margin-bottom: 16px;
}

.contact__accent {
  color: var(--accent);
  text-shadow: 0 0 24px rgba(var(--accent-rgb), 0.4);
}

.contact__text {
  color: var(--text-dim);
  margin-bottom: 28px;
}

.contact__links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.contact__link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  translate: var(--mx, 0) var(--my, 0);
  transition: border-color 0.25s, box-shadow 0.25s, color 0.25s, translate 0.25s var(--ease-out);

  &:hover,
  &:focus-visible {
    color: var(--heading);
    border-color: var(--accent);
    box-shadow: var(--glow);

    .contact__icon {
      transform: scale(1.15) rotate(-6deg);
    }
  }
}

.contact__icon {
  opacity: 0.9;
  transition: transform 0.3s var(--ease-out);
}
</style>
