<template>
  <div class="profile-header component-spacing">
    <div class="flex-display-block">
      <div class="profile-pic-block">
        <b-img
          class="profile-pic"
          alt="Profile Image"
          src="/img/profile_pic.jpg"
          width="175"
        />
      </div>
        <div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.profile-header {
  p {
    margin-bottom: 10px;
  }

  /* Smartphones (portrait) ----------- */
  @media only screen and (max-width: 600px) {
    .flex-display-block {
      display: block !important;
    }

    .profile-pic-block {
      display: flex;
      justify-content: center;
    }
  }

  .flex-display-block {
    display: flex;
    justify-content: flex-start;
    align-items: top;
  }

  .profile-pic {
    margin-right: 20px;
    margin-bottom: 30px;
    border-radius: 50%;
    border: 2px solid #ffffff;
  }
}
</style>
