<template>
    <div
        class="bg-gray-600 rounded-lg border p-2 border-sky-900"
    >
        [{{ entry.id }}] {{ entry.name }}
        <div
            v-for="[subitem, index] in entry.subitems"
            :key="index"
        >
            #{{ index }}: {{ subitem }}
        </div>
        <div>
            Booking time: {{ displayed_time }}
        </div>
        <div class="w-full flex justify-end items-center">
            <button class="bg-slate-400 hover:bg-slate-700 p-2 rounded-md">
                Book time
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Entry } from '~/app.vue';

const get_time = () => new Date().toLocaleString(window.navigator.language ?? 'en');
const current_time = ref<string>();
const displayed_time = computed(() => current_time.value);

defineProps({
    entry: { type: Object as PropType<Entry>, required: true },
});

setInterval(() => {
    current_time.value = get_time();
}, 1000);
</script>
