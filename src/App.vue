<template>
  <div class="app-shell">
    <NavBar />
    <main :class="mainClasses">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const mainClasses = computed(() => (
  route.meta.fullBleed
    ? 'w-full'
    : 'mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8'
))
</script>
