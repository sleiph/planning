interface ISalasState {
  salas: string[]
}

export const useWebsiteStore = defineStore<'websiteStore', ISalasState>('websiteStore', {
    state: () => ({
      salas: []
    }),
    actions: {
      async fetch() {
        this.salas = [];
      },
      async addSala(sala:string) {
        this.salas.push(sala);
      }
    }
})
