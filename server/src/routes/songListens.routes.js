import { Router } from 'express'
import { SONG_LISTENS_FILE, readJson, writeJson } from '../storage.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const listens = await readJson(SONG_LISTENS_FILE)
    res.json(listens)
  } catch (err) {
    console.error('Error al leer song-listens:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/:songId/:userId', async (req, res) => {
  try {
    const songId = Number(req.params.songId)
    const userId = Number(req.params.userId)
    const listens = await readJson(SONG_LISTENS_FILE)

    const listen = listens.find(
      l => l.song_id === songId && l.user_id === userId
    )

    if (!listen) {
      return res.status(404).json({ error: 'Registro no encontrado' })
    }

    res.json(listen)
  } catch (err) {
    console.error('Error al leer song-listen:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { song_id, user_id } = req.body

    if (song_id === undefined || user_id === undefined) {
      return res.status(400).json({
        error: 'Se espera song_id y user_id'
      })
    }

    const listens = await readJson(SONG_LISTENS_FILE)

    const index = listens.findIndex(
      l => l.song_id === song_id && l.user_id === user_id
    )

    let saved

    if (index !== -1) {
      const current = listens[index]
      saved = {
        ...current,
        times_listened: (current.times_listened || 0) + 1
      }
      listens[index] = saved
    } else {
      saved = {
        song_id,
        user_id,
        times_listened: 1
      }
      listens.push(saved)
    }

    await writeJson(SONG_LISTENS_FILE, listens)
    res.status(index === -1 ? 201 : 200).json(saved)
  } catch (err) {
    console.error('Error al crear/incrementar song-listen:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.patch('/:songId/:userId', async (req, res) => {
  try {
    const songId = Number(req.params.songId)
    const userId = Number(req.params.userId)
    const updates = req.body

    const listens = await readJson(SONG_LISTENS_FILE)
    const index = listens.findIndex(
      l => l.song_id === songId && l.user_id === userId
    )

    if (index === -1) {
      return res.status(404).json({ error: 'Registro no encontrado' })
    }

    const { song_id: _ignoreSong, user_id: _ignoreUser, ...rest } = updates

    const updated = {
      ...listens[index],
      ...rest
    }

    listens[index] = updated
    await writeJson(SONG_LISTENS_FILE, listens)

    res.json(updated)
  } catch (err) {
    console.error('Error al actualizar song-listen:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
