import { defineStore } from 'pinia'
import { DB } from '../services/db'


const KEY = 'sl_highlights'


export const useHighlightsStore = defineStore('highlights', {
  state: () => {
    const saved = DB.get(KEY, {
      albumIds: [],
      artistNames: []
    })


    return {
      albumIds: saved.albumIds ?? [],
      artistNames: saved.artistNames ?? []
    }
  },


  getters: {
    isAlbumHighlighted: (s) => (id) =>
      s.albumIds.includes(id),


    isArtistHighlighted: (s) => (name) =>
      s.artistNames.includes(name)
  },


  actions: {
    _save() {
      DB.set(KEY, {
        albumIds: this.albumIds,
        artistNames: this.artistNames
      })
    },


    toggleAlbum(id) {
      if (this.albumIds.includes(id)) {
        this.albumIds = this.albumIds.filter(x => x !== id)
      } else {
        this.albumIds.push(id)
      }
      this._save()
    },


    toggleArtist(name) {
      if (this.artistNames.includes(name)) {
        this.artistNames = this.artistNames.filter(x => x !== name)
      } else {
        this.artistNames.push(name)
      }
      this._save()
    }
  }
})
