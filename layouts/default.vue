<template>
  <main v-if="fullName" class="flex h-screen">
    <Sidebar :full-name="fullName" :email="email" :avatar="avatar" />

    <section class="flex h-full flex-1 flex-col">
      <MobileNavigation
        :full-name="fullName"
        :email="email"
        :avatar="avatar"
        :user-id="userId"
        :account-id="accountId"
      />
      <AppHeader :user-id="userId" :account-id="accountId" />
      <div class="main-content"><slot /></div>
    </section>

    <Toaster />
  </main>
</template>

<script setup lang="ts">
import Toaster from "@/components/ui/toast/Toaster.vue";
import { useQuery } from "@tanstack/vue-query";
import { currentUser } from "~/utils/api";

const email = ref("");
const fullName = ref("");
const avatar = ref("");
const userId = ref("");
const accountId = ref("");

const { data, isError, suspense } = useQuery({
  queryKey: ["current user"],
  queryFn: async () => currentUser(),
});

await suspense();

if (isError.value === true) {
  navigateTo("/sign-in");
}

email.value = data.value.email || "";
fullName.value = data.value.fullName || "";
avatar.value = data.value.avatar || "";
userId.value = data.value.$id || "";
accountId.value = data.value.accountId || "";
</script>
