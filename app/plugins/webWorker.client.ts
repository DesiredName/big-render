import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
    const createWorker = (workerUrl: string): Worker => {
        return new Worker(new URL(workerUrl, import.meta.url), { type: 'module' });
    };

    return {
        provide: {
            worker: {
                create: createWorker,
            },
        },
    };
});
