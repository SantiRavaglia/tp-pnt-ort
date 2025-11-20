import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
  state: () => ({
    searchResults: [],
    searchQuery: '',
    searchType: 'artist',
    searchEntity: 'albums',
    isLoading: false,
    error: null,
    albumListens: [],
    albums: [],
    genres: [],        
    genreListens: []
  }),
  
  actions: {
    setSearchType(type) {
      this.searchType = type
    },

    setSearchEntity(entity) {  
      this.searchEntity = entity
    },

    async fetchAlbums(query, type) {
      this.isLoading = true
      this.error = null
      this.searchQuery = query
      this.searchType = type
      this.searchEntity = 'albums'
      try {
        const res = await fetch('http://localhost:3000/albums');
        if (!res.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        const results = await res.json();
        this.albums = results;

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
  },

  async fetchGenres() {
      try {
        const res = await fetch('http://localhost:3000/genres')
        if (!res.ok) throw new Error('Error en la respuesta de la API')
        this.genres = await res.json()
      } catch (err) {
        console.error('Error al obtener géneros:', err)
        this.genres = []
      }
    },

    async fetchGenreListens() {
      try {
        const res = await fetch('http://localhost:3000/genre-listens')
        if (!res.ok) throw new Error('Error en la respuesta de la API')
        this.genreListens = await res.json()
      } catch (err) {
        console.error('Error al obtener genre listens:', err)
        this.genreListens = []
      }
    },

    async incrementGenreListen(genreId, userId) {
      const i = this.genreListens.findIndex(
        l => (l.genre_id) === genreId && l.user_id === userId
      )

      if (i !== -1) {
        const current = this.genreListens[i]
        const key = current.genre_id
        this.genreListens[i] = {
          ...current,
          genre_id: key,
          times_listened: (current.times_listened || 0) + 1
        }
      } else {
        this.genreListens.push({
          genre_id: genreId,
          user_id: userId,
          times_listened: 1
        })
      }

      try {
        await fetch('http://localhost:3000/genre-listens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ genre_id: genreId, user_id: userId })
        })
      } catch (e) {
        console.error('No se pudo registrar la escucha de género', e)
        await this.fetchGenreListens()
      }
    },

    async searchGenres(query) {
      this.isLoading = true
      this.error = null
      this.searchQuery = query
      this.searchEntity = 'genres'
      try {
        const res = await fetch('http://localhost:3000/genres')
        if (!res.ok) throw new Error('Error en la respuesta de la API')
        const genres = await res.json()
        this.genres = genres

        const q = query.toLowerCase()
        this.searchResults = genres.filter(g =>
          g.name.toLowerCase().includes(q)
        )
      } catch (err) {
        this.error = 'Error al buscar géneros. Intente de nuevo.'
        this.searchResults = []
      } finally {
        this.isLoading = false
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

      return s.albums
        .map(a => ({
          ...a,
          total_listens: totals.get(a.id) || 0
        }))
        .filter(a => a.total_listens > 0)
        .sort((a, b) => b.total_listens - a.total_listens)
    },

    genresWithListens: (s) => {
      if (!s.genreListens.length || !s.genres.length) return []

      const totals = new Map()

      for (const l of s.genreListens) {
        if (!l) continue
        const genreKey = l.genre_id
        if (!genreKey) continue
        const prev = totals.get(genreKey) || 0
        totals.set(genreKey, prev + (l.times_listened || 0))
      }

      return s.genres
        .map(g => ({
          ...g,
          total_listens: totals.get(g.id) || 0
        }))
        .filter(g => g.total_listens > 0)
        .sort((a, b) => b.total_listens - a.total_listens)
    },

    genreTimeByUser: (s) => (userId) => {
    if (!userId || !s.albums.length || !s.albumListens.length || !s.genres.length) {
      return []
    }

    const timePerGenre = new Map() // genreId -> segundos totales

    for (const listen of s.albumListens) {
      if (!listen) continue
      if (listen.user_id !== userId) continue

      const albumId = listen.album_id
      if (!albumId) continue

      const album = s.albums.find(a => a.id === albumId)
      if (!album) continue

      const genreId = album.genre_id
      if (!genreId) continue

      const durationSeconds = album.duration_s || 0
      const times = listen.times_listened || 0
      const totalSeconds = durationSeconds * times

      const prev = timePerGenre.get(genreId) || 0
      timePerGenre.set(genreId, prev + totalSeconds)
    }

    return s.genres
      .map(g => ({
        ...g,
        total_seconds: timePerGenre.get(g.id) || 0
      }))
      .filter(g => g.total_seconds > 0)
      .sort((a, b) => b.total_seconds - a.total_seconds)
  },

  getAlbums() {
    if (!this.albums.length) {
      fetchAlbums('', 'artist');
    } 
    return this.albums;
  },

  topAlbums() {
      return this.albumsWithListens.slice(0, 5)
    },


  topArtists() {
      const totals = new Map()

      for (const album of this.albumsWithListens) {
        const key = album.artist
        const prev = totals.get(key) || 0
        totals.set(key, prev + album.total_listens)
      }

      return Array.from(totals, ([name, total_listens]) => ({ name, total_listens }))
        .sort((a, b) => b.total_listens - a.total_listens)
        .slice(0, 5)
    }
  }
})