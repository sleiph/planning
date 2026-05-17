<script setup>
    //TODO: usar typescript

    const endereco = import.meta.env.VITE_APP_URL + ":" + import.meta.env.VITE_PORT;

    const props = defineProps(['sala']);
    const sala = props['sala'];

    //const store = useWebsiteStore();
    //await useAsyncData('sala', () => store.getSala());

</script>

<template>
    <div class="w-full col-span-12 py-4 px-8 text-center bg-cinza-claro dark:bg-cinza dark:border-cinza-escuro border-cinza-claro rounded-lg shadow">
        <p>{{ endereco + "/" + sala }}</p>
        <button class="text-cinza bg-cinza-claro hover:bg-rosa focus:outline-none focus:ring-4 focus:ring-cinza-claro font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-branco dark:hover:bg-rosa dark:focus:ring-cinza-claro dark:border-cinza">
            <NuxtLink :key="sala" :to="{ name: 'sala-hash', params: { hash: sala } }">
                Entrar na Sala
            </NuxtLink>
        </button>
    </div>
</template>
