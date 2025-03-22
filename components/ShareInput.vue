<script setup lang="ts">
import type { Models } from "node-appwrite";

const { file, onChange, onRemove } = defineProps<{
  file: Models.Document;
  onChange: Function;
  onRemove: Function;
}>();
</script>

<template>
  <ImageThumbnail :file="file" />
  <div class="share-wrapper">
    <p class="subtitle-2 pl-1 text-light-100">Share file with other users</p>
    <UiInput
      type="email"
      placeholder="Enter email address"
      class="share-input-field"
      @change="(e) => onChange(e.target.value.trim().split(','))"
    />
    <div class="pt-4">
      <div class="flex justify-between">
        <p class="subtitle-2 text-light-100">Shared with</p>
        <p class="subtitle-2 text-light-200">{{ file.users.length }} users</p>
      </div>

      <ul class="pt-2">
        <li
          v-for="email in file.users"
          :key="email"
          class="flex items-center justify-between gap-2"
        >
          <p class="subtitle-2">{{ email }}</p>
          <Button @click="() => onRemove(email)">
            <NuxtImg
              alt="remove"
              src="/assets/icons/remove.svg"
              width="24"
              height="24"
              class="remove-icon"
            />
          </Button>
        </li>
      </ul>
    </div>
  </div>
</template>
