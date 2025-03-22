<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

useSeoMeta({
  description: "StoreIt - The only storage solution you need.",
  titleTemplate: "%s - StoreIt",
});
</script>
