<script>
  import { themes, currentThemeId } from "./theme.js";

  let open = $state(false);

  function select(id) {
    $currentThemeId = id;
    open = false;
  }
</script>

<div class="fixed top-4 left-4 z-50">
  <button
    onclick={() => (open = !open)}
    class="w-8 h-8 rounded-full border border-current opacity-40 hover:opacity-100
           transition-opacity duration-300 flex items-center justify-center"
    aria-label="Switch theme"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  </button>

  {#if open}
    <div class="mt-2 rounded-lg border border-current/10 bg-[var(--color-cream)] shadow-lg overflow-hidden">
      {#each themes as theme}
        <button
          onclick={() => select(theme.id)}
          class="flex items-center gap-3 w-full px-4 py-2.5 text-left font-display text-xs tracking-wide
                 transition-colors duration-200 hover:bg-current/5"
          class:opacity-100={$currentThemeId === theme.id}
          class:opacity-50={$currentThemeId !== theme.id}
        >
          <span
            class="w-4 h-4 rounded-full border border-current/20 shrink-0"
            style="background: {theme.bg}; box-shadow: inset 0 0 0 2px {theme.rose};"
          ></span>
          {theme.label}
        </button>
      {/each}
    </div>
  {/if}
</div>