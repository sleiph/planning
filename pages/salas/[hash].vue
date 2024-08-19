<script setup >
    // usar typescript

    const store = useWebsiteStore();
    await useAsyncData('salas', () => store.fetch());

</script>

<template>
    <div class="w-full col-span-10 col-start-2 py-4 px-8 text-center bg-cinza border-cinza-claro rounded-lg shadow">
        
    </div>
    <div class="w-full grid grid-cols-7 gap-4 col-span-10 col-start-2 py-4 px-8 text-center bg-cinza border-cinza-claro rounded-lg shadow">
        <div></div>
        <div class="p-4 w-24 text-center bg-cinza-escuro border-cinza rounded-lg shadow">1</div>
        <div class="p-4 w-24 text-center bg-cinza-escuro border-cinza rounded-lg shadow">2</div>
        <div class="p-4 w-24 text-center bg-cinza-escuro border-cinza rounded-lg shadow">3</div>
        <div class="p-4 w-24 text-center bg-cinza-escuro border-cinza rounded-lg shadow">5</div>
        <div class="p-4 w-24 text-center bg-cinza-escuro border-cinza rounded-lg shadow">?</div>
        <div></div>
    </div>
    <div class="col-start-11 row-start-3 justify-self-end">
        <NuxtLink to="/">
            <Icon name="bx:bxs-home" class="text-xl"/>
        </NuxtLink>
    </div>
</template>