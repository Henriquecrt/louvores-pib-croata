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
    'Ana Laura',
    'Aparecida',
    'Rebeca',
    'Coral MCM',
    'Sophia',
    'Samantha',
    'Linéia'
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
    await addDoc(collection(db, 'songs'), { ...song, views: 0, createdAt: new Date() });
  }

  async updateSong(id: string, data: Partial<Song>) {
    await updateDoc(doc(db, 'songs', id), data);
  }

  async deleteSong(id: string) {
    await deleteDoc(doc(db, 'songs', id));
  }

  // --- CULTOS (CORRIGIDO PARA 'services') ---
  private listenToCultos() {
    // 👇 AQUI ESTAVA 'cultos', MUDEI PARA 'services'
    const cultosCollection = collection(db, 'services'); 
    onSnapshot(cultosCollection, (snapshot) => {
      const cultosData: Culto[] = [];
      snapshot.forEach((doc) => cultosData.push({ id: doc.id, ...doc.data() } as Culto));
      this.cultos.set(cultosData.sort((a, b) => b.date.localeCompare(a.date)));
    });
  }

  async addCulto(culto: Omit<Culto, 'id' | 'songIds'>) {
    // 👇 AQUI TAMBÉM
    await addDoc(collection(db, 'services'), { 
      ...culto, 
      songIds: [], 
      vocals: culto.vocals || [], 
      createdAt: new Date() 
    });
  }

  async updateCulto(id: string, data: Partial<Culto>) {
    // 👇 E AQUI
    await updateDoc(doc(db, 'services', id), data);
  }

  async deleteCulto(id: string) {
    // 👇 E AQUI
    await deleteDoc(doc(db, 'services', id));
  }

  // --- CONTAGEM INTELIGENTE ---
  async addSongToCulto(cultoId: string, songId: string) {
    // 👇 MUDADO PARA 'services'
    await updateDoc(doc(db, 'services', cultoId), { songIds: arrayUnion(songId) });
    await updateDoc(doc(db, 'songs', songId), { views: increment(1) });
  }

  async removeSongFromCulto(cultoId: string, songId: string) {
    // 👇 MUDADO PARA 'services'
    await updateDoc(doc(db, 'services', cultoId), { songIds: arrayRemove(songId) });
    await updateDoc(doc(db, 'songs', songId), { views: increment(-1) });
  }

  async addVocalToCulto(cultoId: string, name: string) {
    if (!name.trim()) return;
    // 👇 MUDADO PARA 'services'
    await updateDoc(doc(db, 'services', cultoId), { vocals: arrayUnion(name.trim()) });
  }

  async removeVocalFromCulto(cultoId: string, name: string) {
    // 👇 MUDADO PARA 'services'
    await updateDoc(doc(db, 'services', cultoId), { vocals: arrayRemove(name) });
  }
}