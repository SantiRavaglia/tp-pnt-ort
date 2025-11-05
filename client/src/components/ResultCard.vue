<script setup>
import { defineProps } from 'vue';

// Define las propiedades (props) que este componente espera recibir
defineProps({
  // Se espera un objeto llamado 'album' con los siguientes campos
  album: {
    type: Object,
    required: true,
    default: () => ({ 
      artist: 'Artista Desconocido', 
      album: 'Título Desconocido', 
      year: 'Año Desconocido' 
    })
  }
});
</script>

<template>
  <div class="card">
    <h3>{{ album.artist }}</h3>
    
    <div class="details">
      <p>
        <strong>Álbum:</strong> {{ album.album }}
      </p>
      <p>
        <strong>Lanzamiento:</strong> {{ album.year }}
      </p>
    </div>

    </div>
</template>

<style scoped>
.result-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.result-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #e4d9d9;
  margin-top: 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.details p {
  margin: 5px 0;
  color: #555;
}

.details strong {
  color: #007bff; /* Color de énfasis */
}
</style>