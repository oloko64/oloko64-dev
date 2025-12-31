<template>
  <div class="tech-stack component-spacing">
    <h3 class="h3-custom stack__title">
      {{ title }}
    </h3>
    <div class="indent-padding">
      <b-img
        v-for="icon in stackIcons"
        :key="icon.name"
        v-b-tooltip.hover.bottom
        class="stack-image"
        :title="icon.name"
        :alt="icon.alt"
        :src="`/img/tech_stack/${icon.name}.png`"
        :width="icon.width"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'My Stack'
  }
})

interface StackIcon {
  name: string;
  link: string;
  alt: string;
  width: string;
}
const stackIcons: StackIcon[] = [
  {
    name: 'rust',
    alt: 'rust',
    width: '45px',
    link: 'https://www.rust-lang.org/'
  },
  {
    name: 'python',
    alt: 'python',
    width: '25px',
    link: 'https://www.python.org/'
  },
  {
    name: 'typescript',
    alt: 'typescript',
    width: '25px',
    link: 'https://www.typescriptlang.org/'
  },
  {
    name: 'javascript',
    alt: 'javascript',
    width: '25px',
    link: 'https://www.javascript.com/'
  },
  {
    name: 'vuejs',
    alt: 'vuejs',
    width: '25px',
    link: 'https://vuejs.org/'
  },
  {
    name: 'linux',
    alt: 'linux',
    width: '25px',
    link: 'https://www.linux.org/'
  },
  {
    name: 'react',
    alt: 'react',
    width: '25px',
    link: 'https://reactjs.org/'
  },
  {
    name: 'git',
    alt: 'git',
    width: '25px',
    link: 'https://git-scm.com/'
  },
  {
    name: 'html5',
    alt: 'html5',
    width: '25px',
    link: 'https://www.w3.org/TR/html5/'
  },
  {
    name: 'nodejs',
    alt: 'nodejs',
    width: '25px',
    link: 'https://nodejs.org/'
  },
  {
    name: 'bootstrap',
    alt: 'bootstrap',
    width: '25px',
    link: 'https://getbootstrap.com/'
  },
  {
    name: 'sass',
    alt: 'sass',
    width: '25px',
    link: 'https://sass-lang.com/'
  }
]
</script>

<style scoped lang="scss">
.tech-stack {
  .stack-image {
    margin-right: 15px;
    border-radius: 15%;
    margin-bottom: 5px;;
  }

  .stack-image:hover {
    transform: scale(1.3);
  }

  .stack__title {
    margin-bottom: 20px;
  }
}
</style>
