<template>
  <AuthForm type="sign-up" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth-layout",
});
useHead({
  title: "Sign Up",
});
</script>
