import { Router } from 'express'
import { SONGS_FILE, readJson, writeJson } from '../storage.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const songs = await readJson(SONGS_FILE)
    res.json(songs)
  } catch (err) {
    console.error('Error al leer songs:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const songs = await readJson(SONGS_FILE)
    const song = songs.find(s => s.id === id)

    if (!song) {
      return res.status(404).json({ error: 'Canción no encontrada' })
    }

    res.json(song)
  } catch (err) {
    console.error('Error al leer song:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/by-album/:albumId', async (req, res) => {
  try {
    const albumId = Number(req.params.albumId)
    const songs = await readJson(SONGS_FILE)
    const filtered = songs.filter(s => s.album_id === albumId)
    res.json(filtered)
  } catch (err) {
    console.error('Error al leer songs por álbum:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { album_id, name, duration_s, track_number } = req.body
    if (!album_id || !name) {
      return res.status(400).json({ error: 'album_id y name son obligatorios' })
    }

    const songs = await readJson(SONGS_FILE)
    const nextId = songs.reduce((max, s) => s.id > max ? s.id : max, 0) + 1

    const newSong = {
      id: nextId,
      album_id,
      name,
      duration_s: duration_s ?? 0,
      track_number: track_number ?? null
    }

    songs.push(newSong)
    await writeJson(SONGS_FILE, songs)

    res.status(201).json(newSong)
  } catch (err) {
    console.error('Error al crear song:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
