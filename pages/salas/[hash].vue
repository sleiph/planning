<script setup lang="ts">

    import { useRoute } from 'vue-router';
    import type { Usuario, Sala } from '../../types';

    const route = useRoute();
    const salaPrm: string = route.params.hash as string;

    const store = useWebsiteStore();
    await useAsyncData('salas', () => store.getSalas());
    const sala: Sala | undefined = store.salas.find(s => s.hash == salaPrm);

    const usrCookie = useCookie('usuario');
    const usuario = ref<Usuario | null>(null);
    const nome = ref<string>('');

    const revelado = ref<boolean>(false);

    const getUsuario = async () => {
        let usrTmp: Usuario = { nome: usrCookie.value as string, nota: 0, sala: salaPrm };
        usuario.value = store.getUsuario(usrTmp);
        if (!usuario.value && usrCookie.value)
            entrar(usrCookie.value as string);
    }

    const entrar = async (nome: string) => {
        let usrTmp: Usuario = { nome: nome, nota: 0, sala: salaPrm };
        try {
            let resposta: Usuario = await store.addUsuario(usrTmp);
            if (resposta?.nome) {
                usrCookie.value = resposta.nome;
            }
            usuario.value = resposta;
            fetchUsuarios();
        } catch (err) {
            console.error(err);
        }
    }
    const sair = () => {
        if (usuario.value) {
            store.removerUsuario( usuario.value );
        }
        usrCookie.value = null;
        nome.value = '';
    }

    const mudaNota = (nota: number) => {
        let usrTmp: Usuario = { nome: usrCookie.value as string, nota: nota, sala: salaPrm };
        store.updateNota(usrTmp);
        fetchUsuarios();
    }

    const limparNotas = () => {
        revelado.value = false;
    }

    const fetchUsuarios = () => {
        useAsyncData('usuarios', () => store.getUsuarios(sala!));
    }

    const toggleRevelar = () => {
        revelado.value = !revelado.value;
    }

    onMounted(() => {
        const intervalo = setInterval(() => {
            fetchUsuarios();
        }, 15 * 1000);

        onBeforeUnmount(() => {
            clearInterval(intervalo);
        });
    });

    onNuxtReady(() => {
        fetchUsuarios();
        getUsuario();
    });

</script>

<template>
    <template v-if="usrCookie">
        <div class="w-full col-span-10 col-start-2 py-4 px-8 text-center bg-cinza border-cinza-claro rounded-lg">
            <Usuario v-for="usr in sala?.usuarios" :usuario="usr" :revelado=revelado />
        </div>

        <ul class="w-full grid grid-cols-7 col-span-10 col-start-2 py-4 px-8 text-center bg-cinza border-cinza-claro rounded-lg shadow">
            <li></li>
            <Carta nome="1" class="px-2" @click="mudaNota(1)"/>
            <Carta nome="2" class="px-2" @click="mudaNota(2)"/>
            <Carta nome="3" class="px-2" @click="mudaNota(3)"/>
            <Carta nome="5" class="px-2" @click="mudaNota(5)"/>
            <Carta nome="?" checada="true" class="px-2" @click="mudaNota(0)"/>
            <li></li>
            <li class="col-span-10 pt-4">
                <button @click="toggleRevelar"
                    class="mx-2 px-5 py-2 text-cinza bg-cinza-claro hover:bg-laranja focus:outline-none focus:ring-4 focus:ring-cinza-claro font-medium rounded-lg text-sm dark:bg-branco dark:hover:bg-rosa dark:focus:ring-cinza-claro dark:border-cinza">
                    {{ revelado ? 'Esconder' : 'Revelar'}} Notas
                </button>
                <button @click="limparNotas"
                    class="mx-2 px-5 py-2 text-branco bg-vermelho hover:bg-rosa focus:outline-none focus:ring-4 focus:ring-cinza-claro font-medium rounded-lg text-sm dark:bg-vermelho dark:hover:bg-rosa dark:focus:ring-cinza-claro dark:border-cinza">
                    Limpar Notas
                </button>
            </li>
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
            <input v-model="nome" class="w-100 h-9 m-3 p-3 text-cinza-escuro" placeholder="Escreva seu nome..." @keypress.enter="entrar(nome)" />
            <div class="m-3">
                <button :disabled="!nome" @click="entrar(nome)" class="text-cinza bg-cinza-claro hover:bg-rosa focus:outline-none focus:ring-4 focus:ring-cinza-claro font-medium rounded-lg text-sm px-5 py-2 dark:bg-branco dark:hover:bg-rosa dark:focus:ring-cinza-claro dark:border-cinza">
                    Entrar
                </button>
            </div>
        </div>
    </template>
</template>