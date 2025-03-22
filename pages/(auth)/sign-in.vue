<template>
  <AuthForm type="sign-in" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth-layout",
});
useHead({
  title: "Sign In",
});
</script>
