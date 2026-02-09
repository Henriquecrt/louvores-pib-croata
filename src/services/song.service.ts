import { Injectable, signal } from '@angular/core';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../firebase-config';

export interface Song {
  id: string;
  title: string;
  artist: string;
  key?: string; 
  lyrics: string;
  tags?: string;
  views?: number;
  youtubeUrl?: string;
  createdAt?: any;
}

// 👇 NOVA INTERFACE: Guarda o ID da música E o tom usado no dia
export interface CultoItem {
  songId: string;
  key: string; 
}

export interface Culto {
  id: string;
  title: string;
  date: string;
  leader?: string;
  songIds: string[]; // Mantemos para compatibilidade
  items?: CultoItem[]; // 👇 NOVA LISTA: Guarda a ordem e os tons
  vocals?: string[]; 
}

@Injectable({
  providedIn: 'root'
})
export class SongService {
  readonly songs = signal<Song[]>([]);
  readonly cultos = signal<Culto[]>([]);

  readonly vocalTeam = signal<string[]>([
    'Ana Laura', 'Aparecida', 'Rebeca', 'Coral MCM', 'Sophia', 'Samantha', 'Linéia'
  ]);

  constructor() {
    this.listenToSongs();
    this.listenToCultos();
  }

  // --- MÚSICAS ---
  private listenToSongs() {
    const songsCollection = collection(db, 'songs');
    onSnapshot(songsCollection, { includeMetadataChanges: true }, (snapshot) => {
      const songsData: Song[] = [];
      snapshot.forEach((doc) => songsData.push({ id: doc.id, ...doc.data() } as Song));
      this.songs.set(songsData.sort((a, b) => a.title.localeCompare(b.title)));
    }, (error) => console.error("Erro músicas:", error));
  }

  async addSong(song: Omit<Song, 'id' | 'views'>) {
    const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
    const newTitleNorm = normalize(song.title);
    const exists = this.songs().some(s => normalize(s.title) === newTitleNorm);

    if (!exists) {
      await addDoc(collection(db, 'songs'), { ...song, views: 0, createdAt: new Date() });
      return true;
    }
    return false;
  }

  async updateSong(id: string, data: Partial<Song>) {
    await updateDoc(doc(db, 'songs', id), data);
  }

  async deleteSong(id: string) {
    await deleteDoc(doc(db, 'songs', id));
  }

  // --- CULTOS ---
  private listenToCultos() {
    const cultosCollection = collection(db, 'services'); 
    onSnapshot(cultosCollection, { includeMetadataChanges: true }, (snapshot) => {
      const cultosData: Culto[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as any;

        // 🛡️ MIGRAÇÃO AUTOMÁTICA (NA MEMÓRIA)
        // Se o culto for antigo e não tiver 'items', criamos baseado no 'songIds'
        if (!data.items && data.songIds) {
          data.items = data.songIds.map((id: string) => ({ songId: id, key: 'Original' }));
        }

        cultosData.push({ id: doc.id, ...data } as Culto);
      });
      this.cultos.set(cultosData.sort((a, b) => b.date.localeCompare(a.date)));
    }, (error) => console.error("Erro cultos:", error));
  }

  async addCulto(culto: Omit<Culto, 'id' | 'songIds' | 'items'>) {
    await addDoc(collection(db, 'services'), { 
      ...culto, 
      songIds: [], 
      items: [], // Começa vazio
      vocals: culto.vocals || [], 
      createdAt: new Date() 
    });
  }

  async updateCulto(id: string, data: Partial<Culto>) {
    await updateDoc(doc(db, 'services', id), data);
  }

  async deleteCulto(id: string) {
    await deleteDoc(doc(db, 'services', id));
  }

  // --- RELAÇÕES (MÚSICA NO CULTO) ---

  // 👇 ATUALIZADO: Salva nas duas listas (songIds e items)
  async addSongToCulto(cultoId: string, songId: string, defaultKey: string = '') {
    const newItem: CultoItem = { songId, key: defaultKey };

    await updateDoc(doc(db, 'services', cultoId), { 
      songIds: arrayUnion(songId),
      items: arrayUnion(newItem)
    });
    
    await updateDoc(doc(db, 'songs', songId), { views: increment(1) });
  }

  // 👇 ATUALIZADO: Remove da lista de itens corretamente
  async removeSongFromCulto(culto: Culto, songId: string) {
    // Filtra a lista para remover o item daquela música
    const newItems = (culto.items || []).filter(item => item.songId !== songId);

    await updateDoc(doc(db, 'services', culto.id), { 
      songIds: arrayRemove(songId),
      items: newItems // Atualiza a lista completa
    });
    
    await updateDoc(doc(db, 'songs', songId), { views: increment(-1) });
  }

  // 👇 NOVA FUNÇÃO MÁGICA: Atualiza o tom só neste culto
  async updateCultoTone(culto: Culto, songId: string, newKey: string) {
    // 1. Copia a lista atual
    const newItems = [...(culto.items || [])];
    
    // 2. Acha a música e troca o tom
    const index = newItems.findIndex(item => item.songId === songId);
    if (index !== -1) {
      newItems[index] = { ...newItems[index], key: newKey };
      
      // 3. Salva no banco
      await updateDoc(doc(db, 'services', culto.id), { items: newItems });
    }
  }

  // --- EQUIPE ---
  async addVocalToCulto(cultoId: string, name: string) {
    if (!name.trim()) return;
    await updateDoc(doc(db, 'services', cultoId), { vocals: arrayUnion(name.trim()) });
  }

  async removeVocalFromCulto(cultoId: string, name: string) {
    await updateDoc(doc(db, 'services', cultoId), { vocals: arrayRemove(name) });
  }

  // --- BACKUP ---
  downloadBackup() {
    const data = {
      timestamp: new Date().toISOString(),
      source: 'PIB_CROATA_SYSTEM',
      songs: this.songs(),
      cultos: this.cultos()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_louvores_pib_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async importData(file: File): Promise<{ added: number, skipped: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        try {
          const json = JSON.parse(e.target.result);
          let songsToImport: any[] = json.songs || (Array.isArray(json) ? json : []);
          let added = 0, skipped = 0;

          for (const song of songsToImport) {
            const { id, views, ...songData } = song; 
            if (!songData.title || !songData.lyrics) continue;

            const success = await this.addSong({
              title: songData.title,
              artist: songData.artist || '',
              lyrics: songData.lyrics,
              key: songData.key || '',
              tags: songData.tags || '',
              youtubeUrl: songData.youtubeUrl || ''
            });
            if (success) added++; else skipped++;
          }
          resolve({ added, skipped });
        } catch (error) { reject(error); }
      };
      reader.readAsText(file);
    });
  }
}