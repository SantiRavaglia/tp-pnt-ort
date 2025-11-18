import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
  state: () => ({
    searchResults: [],
    searchQuery: '',
    searchType: 'artist',
    isLoading: false,
    error: null,
    albumListens: [],
    allAlbums: []
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
        const results = await res.json();
        this.allAlbums = results;

        const queryLower = query.toLowerCase();

        this.searchResults = results.filter(disco => {
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

  async incrementAlbumListen(album_id, user_id) {
    const i = this.albumListens.findIndex(l => l.album_id === album_id && l.user_id === user_id)
    if (i !== -1) {
      this.albumListens[i] = {
        ...this.albumListens[i],
        times_listened: (this.albumListens[i].times_listened || 0) + 1
      }
    } else {
      this.albumListens.push({ album_id, user_id: user_id, times_listened: 1 })
    }

    try {
      await fetch('http://localhost:3000/album-listens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ album_id: album_id, user_id: user_id })
      })
    } catch (e) {
      console.error('No se pudo registrar la escucha', e)
      await this.fetchAlbumListens()
    }
  }


  },
  getters: {
    resultsCount: (state) => state.searchResults.length, 
    albumsWithListens: (s) => {
      const totals = new Map()
      for (const l of s.albumListens) {
        if (!l || !l.album_id) continue
        const prev = totals.get(l.album_id) || 0
        totals.set(l.album_id, prev + (l.times_listened || 0))
      }

      return s.allAlbums
        .map(a => ({
          ...a,
          total_listens: totals.get(a.id) || 0
        }))
        .filter(a => a.total_listens > 0)
        .sort((a, b) => b.total_listens - a.total_listens)
    }
  }
})