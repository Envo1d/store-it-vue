<script setup lang="ts">
import { signOut } from "~/utils/api";

const { avatar, userId, fullName, accountId, email } = defineProps<{
  userId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}>();

const route = useRoute();
const pathname = ref(route.path);

const open = ref(false);
const items = ref(navItems);

const logout = async () => await signOut();
</script>

<template>
  <header class="mobile-header">
    <NuxtImg
      src="/assets/icons/logo-full-brand.svg"
      alt="Logo"
      width="120"
      height="52"
      class="h-auto"
    />
    <UiSheet v-model:open="open">
      <UiSheetTrigger>
        <NuxtImg
          src="/assets/icons/menu.svg"
          alt="Search"
          width="30"
          height="30"
        />
      </UiSheetTrigger>
      <UiSheetContent class="shad-sheet h-screen px-3">
        <UiSheetHeader>
          <UiSheetTitle>
            <div class="header-user">
              <NuxtImg
                :src="avatar"
                alt="avatar"
                width="44"
                height="44"
                class="header-user-avatar"
              />
              <div class="sm:hidden lg:block flex flex-col items-start">
                <p class="subtitle-2 capitalize">{{ fullName }}</p>
                <p class="caption">{{ email }}</p>
              </div>
            </div>
            <UiSeparator class="mb-4 bg-light-200/20" />
          </UiSheetTitle>
        </UiSheetHeader>

        <nav class="mobile-nav">
          <ul class="mobile-nav-list">
            <NuxtLink
              v-for="{ name, url, icon } in items"
              :key="name"
              :to="url"
              class="lg:w-full"
            >
              <li
                class="mobile-nav-item"
                :class="pathname === url && 'shad-active'"
              >
                <NuxtImg
                  :src="icon"
                  :alt="name"
                  width="24"
                  height="24"
                  class="nav-icon"
                  :class="pathname === url && 'nav-icon-active'"
                />
                <p>{{ name }}</p>
              </li>
            </NuxtLink>
          </ul>
        </nav>

        <UiSeparator class="my-5 bg-light-200/20" />

        <div class="flex flex-col gap-5 pb-5 justify-between">
          <FileUploader :owner-id="userId" :account-id="accountId" />
          <UiButton
            type="submit"
            class="mobile-sign-out-button"
            @click="logout()"
          >
            <NuxtImg
              src="/assets/icons/logout.svg"
              alt="logo"
              width="24"
              height="24"
            />
            <p>Logout</p>
          </UiButton>
        </div>
      </UiSheetContent>
    </UiSheet>
  </header>
</template>
