<script setup lang="ts">
const { label, value } = defineProps<{ label: string; value: string }>();
</script>

<template>
  <div class="flex">
    <p class="file-details-label text-left">{{ label }}</p>
    <p class="file-details-value text-left">{{ value }}</p>
  </div>
</template>
