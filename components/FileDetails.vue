<script setup lang="ts">
import type { Models } from "node-appwrite";

const { file } = defineProps<{
  file: Models.Document;
}>();
</script>

<template>
  <ImageThumbnail :file="file" />
  <div class="space-y-4 px-2 pt-2">
    <DetailRow label="Format:" :value="file.extension" />
    <DetailRow label="Size:" :value="convertFileSize(file.size)" />
    <DetailRow label="Owner:" :value="file.owner.fullName" />
    <DetailRow label="Last edit:" :value="formatDateTime(file.$updatedAt)" />
  </div>
</template>
