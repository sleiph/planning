<script setup >
    // usar typescript

    const store = useWebsiteStore();
    await useAsyncData('salas', () => store.fetch());

</script>

<template>
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
    <div class="col-start-11 row-start-3 justify-self-end">
        <NuxtLink to="/">
            <Icon name="bx:bxs-home" class="text-xl"/>
        </NuxtLink>
    </div>
</template>