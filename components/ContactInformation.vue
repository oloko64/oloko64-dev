<template>
  <div class="contact-information component-spacing">
    <h3 class="h3-custom">
      Contact Information
    </h3>
    <div class="contact__block">
      <a
        v-for="icon in icons"
        :key="icon.name"
        v-b-tooltip.hover.top
        class="link-icon"
        target="_blank"
        :title="icon.name"
        :href="icon.link"
      >
        <b-img
          class="info-icon"
          :src="`/img/icons/${icon.name}.png`"
          :alt="icon.alt"
          :height="icon.height"
        />
      </a>
    </div>
    <ContactForm />
  </div>
</template>

<script setup lang="ts">
interface Icon {
    name: string;
    link: string;
    alt: string;
    height: string;
}
const icons: Icon[] = [
  {
    name: 'github',
    alt: 'github',
    height: '28px',
    link: 'https://github.com/oloko64'
  },
  {
    name: 'telegram',
    alt: 'telegram',
    height: '28px',
    link: 'https://t.me/5516997226813'
  },
  {
    name: 'whatsapp',
    alt: 'whatsapp',
    height: '28px',
    link: 'https://wa.me/qr/B5FIPTNB2QW2I1'
  },
  {
    name: 'linkedin',
    alt: 'linkedin',
    height: '28px',
    link: 'https://www.linkedin.com/in/reinaldo-rozato-junior-309ba319a/'
  },
  {
    name: 'email',
    alt: 'email',
    height: '28px',
    link: 'mailto:reinaldorozatoj.11cg1@aleeas.com'
  }
]
</script>

<style scoped lang="scss">
.contact-information {
  .contact__block {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 2em;
  }

  .link-icon {
    padding: 0 10px;
    opacity: 0.8;
  }

  .info-icon:hover {
    transform: scale(1.3);
  }
}
</style>
