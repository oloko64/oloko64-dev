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
          My name is Reinaldo Rozato Junior, graduated in Computer Science at
          UNIP.
        </p>
        <p>
          With over 2 years of experience in programming, I have developed a passion for software engineering.
          I am proficient in several programming languages including Javascript, Typescript, Rust, and Python.
        </p>
        <p>
          My skills in both frontend and backend development have allowed me to work on various projects, providing me with a wide range of experience.
        </p>
        <p>
          I am currently based in Araraquara, Brazil, and I am always excited to meet new people and work on challenging projects.
          If you have any question or wish to collaborate on a project, please do not hesitate to get in touch with me.
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
