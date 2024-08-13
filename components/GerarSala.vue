<script setup>
    const store = useWebsiteStore();
    // we could also extract the data, but it's already present in the store
    await useAsyncData('salas', () => store.fetch());
</script>

<template>
    <div class="w-full col-span-3 col-start-2 py-4 px-8 bg-cinza text-center border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <p class="text-branco">{{ store.salas.length }}/4 salas sendo usadas</p>
        <br>
        <button class="text-cinza bg-cinza-claro hover:bg-rosa focus:outline-none focus:ring-4 focus:ring-cinza-claro font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-branco dark:hover:bg-rosa dark:focus:ring-cinza-claro dark:border-cinza">Gerar Sala</button>
        <p class="text-branco">
            Hash: ############
            <button><Icon name="bx:bxs-copy-alt"/></button>
        </p>
    </div>
</template>
