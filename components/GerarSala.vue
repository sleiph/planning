<script setup >
    // usar typescript

    const store = useWebsiteStore();
    await useAsyncData('salas', () => store.fetch());

    const endereco = "localhost:3000"
    function gerarHash() {
        store.addSala((+new Date).toString(36));
    }
    function removerSala(indice) {
        store.removerSala(indice);
    }
</script>

<template>
    <div class="w-full col-span-3 col-start-2 py-4 px-8 bg-cinza text-center border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <p class="text-branco">{{ store.salas.length }}/4 salas sendo usadas</p>
        <br>
        <button :disabled="store.salas.length >= 4" @click="gerarHash" class="text-cinza bg-cinza-claro hover:bg-rosa focus:outline-none focus:ring-4 focus:ring-cinza-claro font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-branco dark:hover:bg-rosa dark:focus:ring-cinza-claro dark:border-cinza">Gerar Sala</button>
        <li class="pt-4 text-branco font-mono list-none" v-for="sala in store.salas">
            {{ endereco + "/" + sala }}
            <NuxtLink :to="{ name: 'salas-hash', params: { hash: sala } }"><Icon name="bx:link-external"/></NuxtLink>
            <button @click="removerSala(store.salas.indexOf(sala))"><Icon name="bx:bxs-trash"/></button>
        </li>
    </div>
</template>
