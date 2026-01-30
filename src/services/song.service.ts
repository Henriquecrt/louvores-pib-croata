import { Injectable, signal } from '@angular/core';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove, increment, getDocs, query, where } from 'firebase/firestore';
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

export interface Culto {
  id: string;
  title: string;
  date: string;
  leader?: string;
  songIds: string[];
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
    onSnapshot(songsCollection, (snapshot) => {
      const songsData: Song[] = [];
      snapshot.forEach((doc) => songsData.push({ id: doc.id, ...doc.data() } as Song));
      this.songs.set(songsData.sort((a, b) => a.title.localeCompare(b.title)));
    });
  }

  async addSong(song: Omit<Song, 'id' | 'views'>) {
    // Normaliza para comparar (Maiúsculo e sem acentos)
    const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
    const newTitleNorm = normalize(song.title);

    // Verifica se já existe no array local (muito mais rápido que consultar o banco)
    const exists = this.songs().some(s => normalize(s.title) === newTitleNorm);

    if (!exists) {
      await addDoc(collection(db, 'songs'), { ...song, views: 0, createdAt: new Date() });
      return true; // Adicionou
    }
    return false; // Duplicada
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
    onSnapshot(cultosCollection, (snapshot) => {
      const cultosData: Culto[] = [];
      snapshot.forEach((doc) => cultosData.push({ id: doc.id, ...doc.data() } as Culto));
      this.cultos.set(cultosData.sort((a, b) => b.date.localeCompare(a.date)));
    });
  }

  async addCulto(culto: Omit<Culto, 'id' | 'songIds'>) {
    await addDoc(collection(db, 'services'), { 
      ...culto, 
      songIds: [], 
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

  // --- RELAÇÕES ---
  async addSongToCulto(cultoId: string, songId: string) {
    await updateDoc(doc(db, 'services', cultoId), { songIds: arrayUnion(songId) });
    await updateDoc(doc(db, 'songs', songId), { views: increment(1) });
  }

  async removeSongFromCulto(cultoId: string, songId: string) {
    await updateDoc(doc(db, 'services', cultoId), { songIds: arrayRemove(songId) });
    await updateDoc(doc(db, 'songs', songId), { views: increment(-1) });
  }

  async addVocalToCulto(cultoId: string, name: string) {
    if (!name.trim()) return;
    await updateDoc(doc(db, 'services', cultoId), { vocals: arrayUnion(name.trim()) });
  }

  async removeVocalFromCulto(cultoId: string, name: string) {
    await updateDoc(doc(db, 'services', cultoId), { vocals: arrayRemove(name) });
  }

  // --- BACKUP & IMPORTAÇÃO 🔄 ---
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

  // Função para processar o arquivo JSON
  async importData(file: File): Promise<{ added: number, skipped: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e: any) => {
        try {
          const json = JSON.parse(e.target.result);
          let songsToImport: any[] = [];

          // Identifica se é backup completo ou lista simples
          if (json.songs && Array.isArray(json.songs)) {
            songsToImport = json.songs;
          } else if (Array.isArray(json)) {
            songsToImport = json;
          }

          let added = 0;
          let skipped = 0;

          for (const song of songsToImport) {
            // Removemos o ID antigo para o Firebase criar um novo limpo
            const { id, views, ...songData } = song; 
            
            // Garantimos que os campos obrigatórios existam
            if (!songData.title || !songData.lyrics) continue;

            const success = await this.addSong({
              title: songData.title,
              artist: songData.artist || '',
              lyrics: songData.lyrics,
              key: songData.key || '',
              tags: songData.tags || '',
              youtubeUrl: songData.youtubeUrl || ''
            });

            if (success) added++;
            else skipped++;
          }

          resolve({ added, skipped });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.readAsText(file);
    });
  }
}