<template>
  <form class="contact-form" novalidate @submit.prevent="sendEmail">
    <AppAlert :show="messageWasSentSuccessfully" variant="success">
      Message was sent successfully!
    </AppAlert>
    <AppAlert :show="messageWasSentError" variant="danger">
      Something went wrong!
    </AppAlert>

    <label class="field">
      <span class="field__label"><span class="field__prompt">&gt;</span> contact</span>
      <input
        v-model="formData.contact"
        class="field__input"
        type="text"
        maxlength="50"
        placeholder="Contact (email, phone, etc)"
      >
    </label>
    <label class="field">
      <span class="field__label"><span class="field__prompt">&gt;</span> subject</span>
      <input
        v-model="formData.subject"
        class="field__input"
        type="text"
        maxlength="50"
        placeholder="Subject"
      >
    </label>
    <label class="field">
      <span class="field__label">
        <span><span class="field__prompt">&gt;</span> message</span>
        <span class="field__count">{{ formData.body.length }}/2000</span>
      </span>
      <textarea
        v-model="formData.body"
        class="field__input field__input--area"
        placeholder="Enter a message..."
        maxlength="2000"
        rows="5"
      />
    </label>

    <button v-magnetic class="btn btn--primary contact-form__submit" type="submit" :disabled="!isSendable || isSendLoading">
      <template v-if="!isSendLoading">
        Send me a message <span aria-hidden="true">&rarr;</span>
      </template>
      <AppSpinner v-else small label="Sending" />
    </button>
  </form>
</template>

<script setup lang="ts">
import { sendContactEmail } from '~/utils/api'

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
  if (!isSendable.value || isSendLoading.value) return
  try {
    isSendLoading.value = true
    await sendContactEmail(formData.value.contact, formData.value.subject, formData.value.body)
    formData.value.contact = ''
    formData.value.subject = ''
    formData.value.body = ''
    messageWasSentSuccessfully.value = true
    setTimeout(() => {
      messageWasSentSuccessfully.value = false
    }, 5000)
  } catch {
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
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-dim);
}

.field__prompt {
  color: var(--accent);
}

.field__count {
  font-size: 0.7rem;
}

.field__input {
  width: 100%;
  padding: 12px 14px;
  font: inherit;
  font-size: 0.9rem;
  color: var(--heading);
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
  caret-color: var(--accent-bright);
  transition: border-color 0.25s, box-shadow 0.25s, background-color 0.25s;

  &::placeholder {
    color: rgb(110, 116, 120);
  }

  &:focus {
    border-color: var(--accent);
    background: rgba(var(--accent-rgb), 0.04);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.15), var(--glow);
  }

  &--area {
    resize: vertical;
    min-height: 120px;
    max-height: 320px;
  }
}

.contact-form__submit {
  align-self: flex-start;
  min-width: 230px;
  margin-top: 4px;
}
</style>
