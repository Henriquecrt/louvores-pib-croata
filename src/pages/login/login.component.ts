import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div class="w-full max-w-md bg-white dark:bg-[#1a2e1a] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/5">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4">
            <span class="material-symbols-outlined text-2xl">lock</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Área do Administrador</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Entre para gerenciar louvores e cultos</p>
        </div>

        <form (ngSubmit)="handleLogin()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input [(ngModel)]="email" name="email" type="email" class="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" placeholder="admin@gpv.com" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha</label>
            <input [(ngModel)]="password" name="password" type="password" class="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" placeholder="••••••••" required>
          </div>

          @if (errorMsg) {
            <div class="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center font-medium">
              {{ errorMsg }}
            </div>
          }

          <button type="submit" class="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20">
            Entrar no Sistema
          </button>
        </form>

        <div class="mt-6 text-center">
          <a routerLink="/" class="text-sm text-gray-500 hover:text-primary transition-colors">Voltar para o Início</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  email = '';
  password = '';
  errorMsg = '';

  async handleLogin() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']); // Manda para home após logar
    } catch (err) {
      this.errorMsg = 'Email ou senha incorretos.';
    }
  }
}