<script setup>
    // usar typescript

    const store = useWebsiteStore();
    await useAsyncData('salas', () => store.fetch());

    const usuario = useCookie('usuario');
    const nome = ref('');

    const entrar = () => {
        console.log(nome.value)
        usuario.value = { nome: nome.value }
        console.log(usuario);
    }
    const sair = () => {
        usuario.value = null
    }

</script>

<template>
    <template v-if="usuario">
        <div class="w-full col-span-10 col-start-2 py-4 px-8 text-center bg-cinza border-cinza-claro rounded-lg shadow">
        
        </div>

        <ul class="w-full grid grid-cols-7 gap-4 col-span-10 col-start-2 py-4 px-8 text-center bg-cinza border-cinza-claro rounded-lg shadow">
            <li></li>
            <Carta nome="1" />
            <Carta nome="2" />
            <Carta nome="3" />
            <Carta nome="5" />
            <Carta nome="?" checada="true" />
            <li></li>
        </ul>

        <button @click="sair" class="col-start-10 row-start-3 justify-self-end">
            <Icon name="bx:log-out" class="text-xl"/>
        </button>
        <div class="col-start-11 row-start-3 justify-self-end">
            <NuxtLink to="/"><Icon name="bx:bxs-home" class="text-xl"/></NuxtLink>
        </div>
    </template>

    <template v-else>
        <h5 class="col-span-10 col-start-2 mb-2 text-branco text-center text-3xl font-bold text-gray-900 dark:text-white">Nome:</h5>
        <div class="col-span-10 col-start-2 inline-flex">
            <input v-model="nome" class="w-100 h-9 m-3 p-3 text-cinza-escuro" placeholder="Escreva seu nome..." @keypress.enter="entrar()" />
            <div class="m-3">
                <button :disabled="!nome" @click="entrar" class="text-cinza bg-cinza-claro hover:bg-rosa focus:outline-none focus:ring-4 focus:ring-cinza-claro font-medium rounded-lg text-sm px-5 py-2 dark:bg-branco dark:hover:bg-rosa dark:focus:ring-cinza-claro dark:border-cinza">Entrar</button>
            </div>
        </div>
    </template>
</template>