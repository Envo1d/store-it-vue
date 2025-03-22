<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getFiles } from "~/utils/api";

const route = useRoute();

const type = ref(route.params.type as string);

const { data, suspense } = useQuery({
  queryKey: ["files"],
  queryFn: async () =>
    getFiles({
      type: type.value,
      searchText: "",
      sort: "$createdAt-desc",
      limit: 15,
    }),
});

await suspense();

useHead({
  title: type.value.charAt(0).toUpperCase() + type.value.slice(1),
});
</script>

<template>
  <div class="page-container">
    <section class="w-full">
      <h1 class="h1 capitalize">{{ type }}</h1>

      <div class="total-size-section">
        <p class="body-1">Total: <span class="h5">0 MB</span></p>

        <div class="sort-container">
          <p class="body-1 hidden sm:block text-light-200">Sort by:</p>
          <Sort />
        </div>
      </div>
    </section>

    <section v-if="data && data.total > 0" class="file-list">
      <Card v-for="file in data.documents" :key="file.$id" :file="file" />
    </section>
    <p v-else class="empty-list">No files uploaded</p>
  </div>
</template>
