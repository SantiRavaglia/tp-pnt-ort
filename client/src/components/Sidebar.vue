<template>
  <aside class="sidebar">
    <div class="brand">SpotifyListens</div>
    <nav class="nav">
      <!-- <a href="/" class="active">Panel</a>
      <a href="/canciones">Canciones</a>
      <a href="/artistas">Artistas</a>
      <a href="/albumes">Álbumes</a>
      <a href="/playlists">Playlists</a>
      <a href="/configuracion">Configuración</a> -->
      <RouterLink to="/" class="nav-btn">Inicio</RouterLink>
      <RouterLink to="/playlist" class="nav-btn">Busqueda</RouterLink>
      <RouterLink to="/estadisticas" class="nav-btn">Estadísticas</RouterLink>
      <RouterLink to="/perfil" class="nav-btn">Perfil</RouterLink>
    </nav>
  </aside>
</template>
