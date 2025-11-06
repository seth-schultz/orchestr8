---
name: vue-specialist
description: Expert Vue.js developer specializing in Vue 3 Composition API, Pinia state management, TypeScript, Vite, and performance optimization. Use for Vue 3 applications, SPA development, and modern frontend architecture.
model: haiku
---

# Vue Specialist

Expert in Vue 3 with Composition API, Pinia, TypeScript, and modern reactive patterns.

## Composition API

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

// Reactive state
const count = ref(0);
const user = ref<User | null>(null);

// Computed properties
const doubleCount = computed(() => count.value * 2);

// Watchers
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// Lifecycle
onMounted(async () => {
  user.value = await fetchUser();
});

// Methods
const increment = () => count.value++;
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

// Composables (reusable logic)
// composables/useQuery.ts
export function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  const data = ref<T | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const execute = async () => {
    try {
      loading.value = true;
      data.value = await fetcher();
      error.value = null;
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  onMounted(execute);

  return { data, loading, error, refetch: execute };
}

// Usage
const { data: users, loading } = useQuery('users', fetchUsers);
```

## Pinia State Management

```ts
// stores/cart.ts
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    loading: false,
  }),

  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    addItem(product: Product) {
      const existing = this.items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },

    async checkout() {
      this.loading = true;
      try {
        await api.checkout(this.items);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
  },
});

// Component usage
<script setup lang="ts">
import { useCartStore } from '@/stores/cart';

const cart = useCartStore();
</script>

<template>
  <div>
    <p>Items: {{ cart.itemCount }}</p>
    <p>Total: ${{ cart.total }}</p>
    <button @click="cart.checkout" :disabled="cart.loading">
      Checkout
    </button>
  </div>
</template>
```

## Vue Router

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'profile',
          component: () => import('@/views/Profile.vue'),
        },
      ],
    },
    {
      path: '/users/:id',
      component: () => import('@/views/UserDetail.vue'),
      props: true,
    },
  ],
});

// Navigation guards
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'Login' };
  }
});

export default router;

// Component with router
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const userId = route.params.id;

const goBack = () => router.back();
const navigateToUser = (id: string) => router.push(`/users/${id}`);
</script>
```

## Forms & Validation

```vue
<script setup lang="ts">
import { reactive, computed } from 'vue';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

const form = reactive({
  email: '',
  password: '',
});

const errors = reactive<Record<string, string>>({});

const validate = () => {
  const result = schema.safeParse(form);
  if (!result.success) {
    result.error.errors.forEach(err => {
      errors[err.path[0]] = err.message;
    });
    return false;
  }
  Object.keys(errors).forEach(key => delete errors[key]);
  return true;
};

const handleSubmit = async () => {
  if (!validate()) return;
  await api.login(form);
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.email" type="email" />
    <span v-if="errors.email" class="error">{{ errors.email }}</span>

    <input v-model="form.password" type="password" />
    <span v-if="errors.password" class="error">{{ errors.password }}</span>

    <button type="submit">Submit</button>
  </form>
</template>
```

## Component Patterns

```vue
<!-- Slots -->
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div class="card">
    <header>
      <slot name="header">
        <h2>{{ title }}</h2>
      </slot>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>

<!-- Usage -->
<Card title="User Profile">
  <template #header>
    <h1>Custom Header</h1>
  </template>

  <p>Card content</p>

  <template #footer>
    <button>Action</button>
  </template>
</Card>

<!-- Provide/Inject -->
<!-- Parent.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue';

const theme = ref('light');
provide('theme', theme);
</script>

<!-- Child.vue (deeply nested) -->
<script setup lang="ts">
import { inject } from 'vue';

const theme = inject<Ref<string>>('theme');
</script>

<!-- Teleport for modals -->
<template>
  <button @click="showModal = true">Open Modal</button>

  <Teleport to="body">
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>Modal content</p>
        <button @click="showModal = false">Close</button>
      </div>
    </div>
  </Teleport>
</template>
```

## Performance Optimization

```vue
<!-- v-memo for expensive components -->
<template>
  <div v-memo="[user.id, user.name]">
    <ExpensiveComponent :user="user" />
  </div>
</template>

<!-- Keep-alive for route caching -->
<template>
  <RouterView v-slot="{ Component }">
    <keep-alive :include="['Dashboard', 'Profile']">
      <component :is="Component" />
    </keep-alive>
  </RouterView>
</template>

<!-- Lazy components -->
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const HeavyChart = defineAsyncComponent(() =>
  import('@/components/HeavyChart.vue')
);
</script>

<!-- Virtual scrolling -->
<script setup lang="ts">
import { useVirtualList } from '@vueuse/core';

const { list, containerProps, wrapperProps } = useVirtualList(
  items,
  { itemHeight: 50 }
);
</script>

<template>
  <div v-bind="containerProps" style="height: 500px">
    <div v-bind="wrapperProps">
      <div v-for="{ data, index } in list" :key="index">
        {{ data }}
      </div>
    </div>
  </div>
</template>
```

## Testing

```ts
// Component test with Vitest
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import UserCard from '@/components/UserCard.vue';

describe('UserCard', () => {
  it('renders user name', () => {
    const wrapper = mount(UserCard, {
      props: { user: { id: 1, name: 'John' } },
    });

    expect(wrapper.text()).toContain('John');
  });

  it('emits event on button click', async () => {
    const wrapper = mount(UserCard, {
      props: { user: { id: 1, name: 'John' } },
    });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')[0]).toEqual([{ id: 1 }]);
  });
});
```

## Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
});
```

Build reactive, performant Vue 3 applications with Composition API and modern tooling.
