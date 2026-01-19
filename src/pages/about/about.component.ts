import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-[#111811] dark:text-gray-100">
      <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#d0e0d0] dark:border-[#1f331f] px-6 lg:px-10 py-4 bg-white dark:bg-[#1a2e1a] sticky top-0 z-50">
        <div class="flex items-center gap-4">
          <div class="size-10 flex items-center justify-center rounded-lg bg-primary/20 text-accent-dark dark:text-primary">
            <span class="material-symbols-outlined text-2xl">library_music</span>
          </div>
          <h2 class="text-accent-dark dark:text-primary text-xl font-bold leading-tight tracking-[-0.015em]">LOUVORES GPV</h2>
        </div>
        <div class="flex flex-1 justify-end gap-8">
          <div class="hidden md:flex items-center gap-9">
            <a routerLink="/" class="text-[#111811] dark:text-gray-200 text-sm font-medium leading-normal hover:text-accent-dark dark:hover:text-primary transition-colors">Início</a>
            <a routerLink="/repertoire" class="text-[#111811] dark:text-gray-200 text-sm font-medium leading-normal hover:text-accent-dark dark:hover:text-primary transition-colors">Buscar</a>
            <a routerLink="/about" class="text-accent-dark dark:text-primary text-sm font-bold leading-normal relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary">Sobre Mim</a>
          </div>
          <button routerLink="/repertoire" class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-primary text-[#111811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-green-400 transition-colors shadow-sm">
            <span class="truncate">Entrar</span>
          </button>
        </div>
      </header>

      <main class="flex-grow flex flex-col items-center justify-center py-12 px-4 md:px-6">
        <div class="w-full max-w-[800px] flex flex-col gap-12">
          <section class="bg-white dark:bg-[#1a2e1a] rounded-2xl p-8 md:p-12 shadow-sm border border-[#e0ebe0] dark:border-[#2a3e2a] text-center">
            <div class="flex justify-center mb-6">
              <div class="size-16 rounded-full bg-primary/10 flex items-center justify-center text-accent-dark dark:text-primary">
                <span class="material-symbols-outlined text-[32px]">diversity_3</span>
              </div>
            </div>
            <h1 class="text-accent-dark dark:text-primary text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.033em] mb-6">
              Nossa Missão
            </h1>
            <div class="space-y-4">
              <p class="text-[#4a554a] dark:text-gray-300 text-lg font-normal leading-relaxed max-w-[640px] mx-auto">
                O <span class="font-bold text-accent-dark dark:text-primary">LOUVORES GPV</span> nasceu com o propósito de facilitar o acesso a letras de louvores, organizando o repertório de forma simples e intuitiva para grupos de louvor e igrejas.
              </p>
              <p class="text-[#4a554a] dark:text-gray-300 text-lg font-normal leading-relaxed max-w-[640px] mx-auto">
                Acreditamos que a tecnologia deve servir como uma ponte, não uma barreira. Queremos que a adoração flua livremente, permitindo que músicos e cantores foquem no que realmente importa: a mensagem e o momento de comunhão.
              </p>
            </div>
            
            <div class="mt-10 grid grid-cols-3 gap-3 md:gap-4 max-w-[500px] mx-auto opacity-90">
              <div class="aspect-[4/3] rounded-lg overflow-hidden relative group">
                <div class="absolute inset-0 bg-accent-dark/10 group-hover:bg-transparent transition-colors z-10"></div>
                <div class="w-full h-full bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKoEvHV4egUGLsVCxLz8Ifgu-ECydnNWD-z4pqzmjogWnRo5stvn4oQ5xK2BMfkNJENt3CcdTow_EaP_90ilpNrOKWqvR5iUgVAmsA6kWTA4wvg9am_kCUJ7_xlf0j9_dA1u19T0shJ4riNuilTnVVFS8Lc5nOberuIesBH6mi5efG8mJ6NlFTQ7HKmItte5tdihXYEBfUxSDl9n_vDv8QrXGTbKvJewM0fWFBM7rS3Tyt6uVVoIF5lVfhMyAthFjSEEXmwMoQp4em');"></div>
              </div>
              <div class="aspect-[4/3] rounded-lg overflow-hidden relative group translate-y-4">
                <div class="absolute inset-0 bg-accent-dark/10 group-hover:bg-transparent transition-colors z-10"></div>
                <div class="w-full h-full bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDG1H9Ry7bHsLU-VxjIipZkNpwGC_TVeU2KY5Empn0KJuEhNYbgHU5zJU7ZkNQHDBKcbMc9Ghu0geIqXa-5KnkeaXNQvMp6pnTSulpxUX31Tphhf8cf8fUg7wBq7z8doiYyHoZvR4ETsyEsuV2bGdrkHIQS9QmQuYEONBSuIMztd5AM6kcQzyhCO6WvmkowgkwyNkn6593DXQ7BnGKqn_IqPWnhGvzatMZDQV3zpJuGyejbsctrqyWyiNcxvoUnNSYy6BdkBxeU-FcU');"></div>
              </div>
              <div class="aspect-[4/3] rounded-lg overflow-hidden relative group">
                <div class="absolute inset-0 bg-accent-dark/10 group-hover:bg-transparent transition-colors z-10"></div>
                <div class="w-full h-full bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2095b1pWjE6WhOQZpO2fMAGrWW0nCcWSgfTH9W4ADuW7b9sSYJosAH2Ffyoy6oYfcGyskxcjy8Z4ixELuew0ZdvUuOAqNuGJSOPUf8FuFIW41KZe4FBrW78kiYnXIzEze-dgs0rMJeZ1lPoJKxa8180nD5Qw12Ntg6zCVUmrsF2j4PweE1SFxsHRE1cyjCDxoLpXTSVfzYuVtL3Jkk-EvEc7LRwEYoJjtQalny6Z_qdKrWyQ-QBv7zTsCTJ2hljX5VsUCyGH1DKen');"></div>
              </div>
            </div>
          </section>

          <section class="flex flex-col items-center gap-6 p-8 rounded-2xl bg-gradient-to-br from-white to-[#f0fff0] dark:from-[#1a2e1a] dark:to-[#0f230f] border border-[#e0ebe0] dark:border-[#2a3e2a] shadow-sm">
            <div class="flex flex-col items-center gap-2 text-center">
              <h2 class="text-[#111811] dark:text-white text-2xl font-bold leading-tight">Entre em Contato</h2>
              <p class="text-[#667066] dark:text-gray-400 text-base">Tem alguma dúvida, sugestão ou quer colaborar com o projeto?</p>
            </div>
            <a href="mailto:midiapibdecroata@gmail.com" class="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white dark:bg-[#253825] border border-primary/30 hover:border-primary shadow-sm hover:shadow-md transition-all duration-300">
              <div class="size-8 rounded-full bg-primary/20 flex items-center justify-center text-accent-dark dark:text-primary group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-lg">mail</span>
              </div>
              <span class="text-accent-dark dark:text-primary font-bold text-lg group-hover:underline">midiapibdecroata@gmail.com</span>
            </a>
          </section>
        </div>
      </main>

      <footer class="bg-white dark:bg-[#1a2e1a] border-t border-[#f0f5f0] dark:border-[#1f331f] py-8">
        <div class="px-6 lg:px-10 max-w-[960px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#667066] dark:text-gray-400">
          <p>© 2024 LOUVORES GPV. Todos os direitos reservados.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-primary transition-colors">Termos</a>
            <a href="#" class="hover:text-primary transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {}