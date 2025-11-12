import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
  state: () => ({
    searchResults: [],
    searchQuery: '',
    searchType: 'artist',
    isLoading: false,
    error: null,
    albumListens: []
  }),
  
  actions: {
    setSearchType(type) {
      this.searchType = type
    },

    async fetchAlbums(query, type) {
      this.isLoading = true
      this.error = null
      this.searchQuery = query
      this.searchType = type
      try {
        const res = await fetch('http://localhost:3000/albums');
        if (!res.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        const dummyResults = await res.json();
        
        const queryLower = query.toLowerCase();

        this.searchResults = dummyResults.filter(disco => {
          if (type === 'artist') return disco.artist.toLowerCase().includes(queryLower);
          if (type === 'album') return disco.album.toLowerCase().includes(queryLower);
          if (type === 'year') return disco.year.toString().includes(queryLower);
          return false;
        });
        
      } catch (err) {
        this.error = "Error al buscar música. Intente de nuevo.";
        this.searchResults = [];
      } finally {
        this.isLoading = false
      }
    },

    async fetchAlbumListens() {
      try {
        const res = await fetch('http://localhost:3000/album-listens');
        if (!res.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        this.albumListens = await res.json();
      } catch (err) {
        console.error("Error al obtener album listens:", err);
        this.albumListens = [];
      }
    },

  async incrementAlbumListen(albumId, userId) {
    const i = this.albumListens.findIndex(l => l.album_id === albumId && l.user_id === userId)
    if (i !== -1) {
      this.albumListens[i] = {
        ...this.albumListens[i],
        times_listened: (this.albumListens[i].times_listened || 0) + 1
      }
    } else {
      this.albumListens.push({ albumId, user_id: userId, times_listened: 1 })
    }

    try {
      await fetch('http://localhost:3000/album-listens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ album_id: albumId, user_id: userId })
      })
    } catch (e) {
      console.error('No se pudo registrar la escucha', e)
      await this.fetchAlbumListens()
    }
  }


  },
  // ✨ Getters: Propiedades computadas basadas en el estado
  getters: {
    // Ejemplo de Getter: devuelve la cantidad de resultados
    resultsCount: (state) => state.searchResults.length, 
  }
})