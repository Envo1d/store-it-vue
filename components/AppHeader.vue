<template>
  <header class="header">
    <Search />
    <div class="header-wrapper">
      <FileUploader :owner-id="userId" :account-id="accountId" />
      <UiButton type="submit" class="sign-out-button" @click="logout()">
        <NuxtImg
          src="/assets/icons/logout.svg"
          alt="logo"
          width="24"
          height="24"
          class="w-6"
        />
      </UiButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const { userId, accountId } = defineProps<{
  userId: string;
  accountId: string;
}>();

const logout = async () => {
  await $fetch("/api/sign-out", {
    method: "POST",
    onResponse({ response }) {
      if (response.status === 200) navigateTo("/sign-in");
    },
    onResponseError() {
      console.log("Failed to send request");
    },
  });
};
</script>
