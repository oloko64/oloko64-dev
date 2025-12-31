<template>
  <div class="contact-form mt-2">
    <b-alert v-if="messageWasSentSuccessfully" class="mt-1" variant="success" :model-value="true">
      Message was sent successfully!
    </b-alert>
    <b-alert v-if="messageWasSentError" class="mt-1" variant="danger" :model-value="true">
      Something went wrong!
    </b-alert>
    <b-button v-if="!isFormVisible && !messageWasSentSuccessfully" class="btn-send-message mt-1" @click="isFormVisible = !isFormVisible">
      Send me a message
    </b-button>
    <b-form v-if="isFormVisible" class="contact__form">
      <b-form-input
        v-model="formData.contact"
        class="mt-1 mb-3 input-custom-color"
        type="text"
        maxlength="50"
        placeholder="Contact (email, phone, etc)"
      />
      <b-form-input
        v-model="formData.subject"
        class="mt-1 mb-3 input-custom-color"
        type="text"
        maxlength="50"
        placeholder="Subject"
      />
      <b-form-textarea
        v-model="formData.body"
        class="input-custom-color"
        placeholder="Enter a message..."
        maxlength="2000"
        rows="4"
        max-rows="6"
      />
      <div class="mt-3">
        <b-button class="btn-send-message" :disabled="!isSendable" @click="sendEmail">
          <span v-if="!isSendLoading">Send</span>
          <b-spinner v-else small label="Spinning" />
        </b-button>
        <b-button class="btn-close-message ms-1" @click="isFormVisible = !isFormVisible">
          Close
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script setup lang="ts">
import { sendContactEmail } from '~/utils/api'

const isFormVisible = ref(false)
const formData = ref({
  contact: '',
  subject: '',
  body: ''
})
const isSendLoading = ref(false)
const messageWasSentSuccessfully = ref(false)
const messageWasSentError = ref(false)

const isSendable = computed(() => {
  return formData.value.subject.length > 0 && formData.value.body.length > 0 && formData.value.contact.length > 0
})

const sendEmail = async () => {
  try {
    isSendLoading.value = true
    await sendContactEmail(formData.value.contact, formData.value.subject, formData.value.body)
    formData.value.contact = ''
    formData.value.subject = ''
    formData.value.body = ''
    isFormVisible.value = false
    messageWasSentSuccessfully.value = true
    setTimeout(() => {
      messageWasSentSuccessfully.value = false
    }, 5000)
  } catch (_) {
    messageWasSentError.value = true
    setTimeout(() => {
      messageWasSentError.value = false
    }, 5000)
  } finally {
    isSendLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.contact-form {
    .contact__form {
        max-width: 600px;
    }

    .btn-send-message {
        width: 230px;
        background-color: rgb(0, 131, 100);
        border-color: rgb(0, 131, 100);
    }

    .input-custom-color {
        background-color: rgb(62, 62, 62);
        border-color: rgb(62, 62, 62);
        color: white;
        &::placeholder {
            color: rgb(130, 130, 130);
        }
    }

    .btn-close-message {
        width: 120px;
    }
}
</style>
