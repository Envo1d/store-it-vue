<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

type FormType = "sign-in" | "sign-up";

const { type } = defineProps<{
  type: FormType;
}>();

const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");
const accountId = ref<string>("");

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    fullName:
      type === "sign-up" ? z.string().min(2).max(50) : z.string().optional(),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const queryClient = useQueryClient();

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;
  errorMessage.value = "";

  if (type === "sign-up")
    await $fetch("/api/sign-in", {
      method: "POST",
      body: {
        fullName: values.fullName,
        email: values.email,
      },
      onResponse({ response }) {
        accountId.value = response._data;
        isLoading.value = false;
      },
      onResponseError() {
        errorMessage.value = "Failed to create account. Please try again.";
      },
    });
  else
    await $fetch("/api/sign-in", {
      method: "POST",
      body: {
        email: values.email,
      },
      onResponse({ response }) {
        accountId.value = response._data;
        isLoading.value = false;
      },
      onResponseError() {
        errorMessage.value = "Failed to create account. Please try again.";
      },
    });
});
</script>

<template>
  <form class="auth-form" @submit="onSubmit">
    <h1 class="form-title">
      {{ type === "sign-in" ? "Sign In" : "Sign Up" }}
    </h1>

    <UiFormField
      v-if="type === 'sign-up'"
      v-slot="{ componentField }"
      name="fullName"
    >
      <UiFormItem>
        <div class="shad-form-item">
          <UiFormLabel class="shad-form-label">Full Name</UiFormLabel>
          <UiFormControl>
            <UiInput
              v-bind="componentField"
              type="text"
              placeholder="Enter your full name"
              class="shad-input"
              required
            />
          </UiFormControl>
        </div>
        <UiFormMessage class="shad-form-message" />
      </UiFormItem>
    </UiFormField>

    <UiFormField v-slot="{ componentField }" name="email">
      <UiFormItem>
        <div class="shad-form-item mt-4">
          <UiFormLabel class="shad-form-label">Email</UiFormLabel>
          <UiFormControl>
            <UiInput
              v-bind="componentField"
              type="email"
              placeholder="Enter your email"
              class="shad-input"
            />
          </UiFormControl>
        </div>
        <UiFormMessage class="shad-form-message" />
      </UiFormItem>
    </UiFormField>

    <UiButton type="submit" class="form-submit-button" :disabled="isLoading">
      {{ type === "sign-in" ? "Sign In" : "Sign Up" }}

      <NuxtImg
        v-if="isLoading === true"
        src="/assets/icons/loader.svg"
        alt="loader"
        class="ml-2 animate-spin"
        width="24"
        height="24"
      />
    </UiButton>

    <p v-if="errorMessage" class="error-message">*{{ errorMessage }}</p>

    <div class="body-2 flex justify-center">
      <p class="text-light-100">
        {{
          type === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"
        }}
      </p>
      <NuxtLink
        :to="type === 'sign-in' ? '/sign-up' : '/sign-in'"
        class="ml-1 font-medium text-brand"
        >{{ type === "sign-in" ? "Sign Up!" : "Sign In!" }}</NuxtLink
      >
    </div>
  </form>
  <OTPModal
    v-if="accountId && form.values.email"
    :email="form.values.email"
    :account-id="accountId"
  />
</template>
