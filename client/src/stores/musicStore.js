import { defineStore } from 'pinia'
// También necesitarás importar Axios aquí más adelante para las peticiones API
// import axios from 'axios' 

export const useMusicStore = defineStore('music', {
  // 💾 State: Variables que Pinia gestiona
  state: () => ({
    searchResults: [],
    searchQuery: '',
    searchType: 'artist', // Valores posibles: 'artist', 'album', 'year'
    isLoading: false,
    error: null,
  }),
  
  // ⚙️ Actions: Lógica para modificar el estado (incluye llamadas API)
  actions: {
    setSearchType(type) {
      this.searchType = type
    },

    async fetchMusic(query, type) {
      this.isLoading = true
      this.error = null
      this.searchQuery = query
      this.searchType = type
      try {
        // *** Aquí va la lógica real de la API que implementaremos después ***
        // const response = await axios.get(`TU_API_URL/search?q=${query}&type=${type}`);
        
        // Simulación de datos para empezar a trabajar con la UI
        const dummyResults = [
          { id: 1, artist: "Queen", album: "A Night at the Opera", year: 1975 },
          { id: 2, artist: "The Beatles", album: "Abbey Road", year: 1969 },{ id: 3, artist: "Pink Floyd", album: "The Dark Side of the Moon", year: 1973 },
          { id: 4, artist: "Led Zeppelin", album: "Led Zeppelin IV", year: 1971 },
          { id: 5, artist: "Nirvana", album: "Nevermind", year: 1991 },
          { id: 6, artist: "Michael Jackson", album: "Thriller", year: 1982 },
          { id: 7, artist: "Fleetwood Mac", album: "Rumours", year: 1977 },
          { id: 8, artist: "The Rolling Stones", album: "Sticky Fingers", year: 1971 },
          { id: 9, artist: "Radiohead", album: "OK Computer", year: 1997 },
          { id: 10, artist: "David Bowie", album: "The Rise and Fall of Ziggy Stardust and the Spiders from Mars", year: 1972 },
          { id: 11, artist: "AC/DC", album: "Back in Black", year: 1980 },
          { id: 12, artist: "U2", album: "The Joshua Tree", year: 1987 },
          { id: 13, artist: "Metallica", album: "Master of Puppets", year: 1986 },
          { id: 14, artist: "The Clash", album: "London Calling", year: 1979 },
          { id: 15, artist: "Oasis", album: "(What's the Story) Morning Glory?", year: 1995 },
          { id: 16, artist: "Green Day", album: "Dookie", year: 1994 },
          { id: 17, artist: "Green Day", album: "American Idiot", year: 2004 },
          { id: 18, artist: "The Ramones", album: "Ramones", year: 1976 },
          { id: 19, artist: "Bad Religion", album: "Suffer", year: 1988 },
          { id: 20, artist: "Bad Religion", album: "Stranger Than Fiction", year: 1994 }
        ];

        // Simulación de un retraso de la red
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        
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
    }
  },
  
  // ✨ Getters: Propiedades computadas basadas en el estado
  getters: {
    // Ejemplo de Getter: devuelve la cantidad de resultados
    resultsCount: (state) => state.searchResults.length, 
  }
})