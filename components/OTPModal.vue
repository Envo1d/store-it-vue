<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { resendEmailOtp, verifySecret } from "~/utils/api";

const { accountId, email } = defineProps<{
  accountId: string;
  email: string;
}>();

const router = useRouter();
const open = ref<boolean>(true);
const password = ref<string[]>([]);
const isLoading = ref<boolean>(false);

const {
  isSuccess,
  error,
  mutateAsync: verifyEmailOTP,
} = useMutation({
  mutationFn: async () => verifySecret(accountId, password.value.join("")),
  mutationKey: ["secret verification"],
});

const handleSubmit = async (e: MouseEvent) => {
  e.preventDefault();
  isLoading.value = true;

  await verifyEmailOTP();

  if (isSuccess.value) {
    await router.push("/");
  } else {
    console.error("Failed to verify OTP", error);
  }

  isLoading.value = false;
};

const { mutate: resendOtp } = useMutation({
  mutationFn: async () => resendEmailOtp(email),
  mutationKey: ["resendEmailOTP"],
});
</script>

<template>
  <UiAlertDialog v-model:open="open">
    <UiAlertDialogContent class="shad-alert-dialog">
      <UiAlertDialogHeader class="relative flex justify-center">
        <UiAlertDialogTitle class="h2 text-center">
          Enter your OTP
          <NuxtImg
            src="/assets/icons/close-dark.svg"
            alt="close"
            width="20"
            height="20"
            class="otp-close-button"
            @click="open = false"
          />
        </UiAlertDialogTitle>
        <UiAlertDialogDescription class="subtitle-2 text-center text-light-100">
          We&apos;ve sent a code to
          <span class="pl-1 text-brand">{{ email }}</span>
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>

      <UiPinInput v-model="password" type="number" maxlength="6">
        <UiPinInputGroup class="shad-otp">
          <UiPinInputInput :index="0" class="shad-otp-slot" />
          <UiPinInputInput :index="1" class="shad-otp-slot" />
          <UiPinInputInput :index="2" class="shad-otp-slot" />
          <UiPinInputInput :index="3" class="shad-otp-slot" />
          <UiPinInputInput :index="4" class="shad-otp-slot" />
          <UiPinInputInput :index="5" class="shad-otp-slot" />
        </UiPinInputGroup>
      </UiPinInput>

      <UiAlertDialogFooter>
        <div class="flex w-full flex-col gap-4">
          <UiAlertDialogAction
            class="shad-submit-btn h-12"
            type="button"
            @click="handleSubmit"
          >
            Submit
            <NuxtImg
              v-if="isLoading"
              src="/assets/icons/loader.svg"
              alt="loader"
              width="24"
              height="24"
              class="ml-2 animate-spin"
            />
          </UiAlertDialogAction>

          <div class="subtitle-2 mt-2 text-center text-light-100">
            Didn&apos;t get a code?
            <UiButton
              type="button"
              variant="link"
              class="pl-1 text-brand"
              @click="resendOtp"
            >
              >Click to resend</UiButton
            >
          </div>
        </div>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
