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
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Entry } from '~/app.vue';

defineProps({
    entry: { type: Object as PropType<Entry>, required: true },
});
</script>
