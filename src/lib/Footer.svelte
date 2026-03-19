<script>
  import { BOOK_TITLE } from "../lib/config.js";
  const year = new Date().getFullYear();
</script>

<footer class="pb-8 pt-6 px-8">
  <div class="mx-auto max-w-[calc(100%-8rem)] h-px bg-charcoal/15 mb-6"></div>
  <p class="text-center font-display text-[10px] tracking-[0.25em] uppercase text-charcoal/35">
    &copy; {year} {BOOK_TITLE} &mdash; All rights reserved
  </p>
</footer>
