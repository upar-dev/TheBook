<script>
  import Header from "./lib/Header.svelte";
  import MeetAuthors from "./lib/MeetAuthors.svelte";
  import BookCanvas from "./lib/BookCanvas.svelte";
  import BookStatic from "./lib/BookStatic.svelte";
  import ContactForm from "./lib/ContactForm.svelte";
  import Footer from "./lib/Footer.svelte";
  import ThemeSwitcher from "./lib/ThemeSwitcher.svelte";

  import "./lib/theme.js";

  let viewMode = $state("static");
</script>

<div class="min-h-screen bg-cream flex flex-col font-body text-charcoal antialiased transition-colors duration-400">
  <ThemeSwitcher />
  <Header />

  <main class="flex-1 flex flex-col items-center">
    <MeetAuthors />

    <!-- View mode switcher -->
    <div class="flex justify-center py-4">
      <div class="relative inline-flex items-center gap-2">
        <span class="font-display text-[10px] tracking-[0.2em] uppercase text-charcoal/40">
          View
        </span>
        <select
          bind:value={viewMode}
          class="appearance-none font-display text-[11px] tracking-[0.15em] uppercase
                 bg-transparent border border-charcoal/15 rounded px-4 py-2 pr-8
                 text-charcoal cursor-pointer outline-none
                 transition-colors duration-300
                 hover:border-charcoal/30 focus:border-rose"
        >
          <option value="static">Static Image</option>
          <option value="3d">3D Model</option>
        </select>
        <!-- Custom dropdown arrow -->
        <svg
          class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/30"
          xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>

    {#if viewMode === "3d"}
      <BookCanvas />
    {:else}
      <BookStatic />
    {/if}

    <ContactForm />
  </main>

  <Footer />
</div>