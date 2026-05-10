<template>
  <div class="col-span-10 col-start-2 space-y-6">

    <h5 class="text-branco text-center text-3xl font-bold text-gray-900 dark:text-white">
      Truco de Planejamento
    </h5>
    
    <div v-if="isAuthenticated && currentUser.sala" class="space-y-4">
      <div class="text-center text-white">
        <p class="text-lg">Bem-vindo, {{ currentUser.usuario }}!</p>
        <button 
          @click="logout"
          class="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200"
        >
          Sair
        </button>
      </div>
      <SalaOpcoes :sala="currentUser.sala"/>
    </div>

    <Auth v-else @authenticated="handleAuthentication" />

  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import Auth from '../components/Auth.vue';
import SalaOpcoes from '~/components/SalaOpcoes.vue';

const isAuthenticated = ref(false);
const currentUser = ref({ usuario: '', isAuthenticated: false, sala: '' });

const handleAuthentication = (userData) => {
  isAuthenticated.value = true;
  console.log(userData);
  currentUser.value = userData;
  localStorage.setItem('usuario', JSON.stringify(userData));
}

const logout = () => {
  isAuthenticated.value = false;
  currentUser.value = { usuario: '', isAuthenticated: false, sala: '' };
  localStorage.removeItem('usuario');
}

if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('usuario');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      handleAuthentication(userData);
    } catch (error) {
      console.error('Erro parseando os dados do usuario:', error);
      localStorage.removeItem('usuario');
    }
  }
}
</script>
