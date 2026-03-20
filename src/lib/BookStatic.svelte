<script>
  import { BOOK_TITLE } from "../lib/config.js";
  import bookImg from "../assets/book_model.png";
</script>

<section class="flex flex-col items-center justify-center py-16 md:py-24">
  <div class="relative">
    <!-- Book image -->
    <img
      src={bookImg}
      alt={BOOK_TITLE}
      class="w-[320px] md:w-[400px] h-auto object-contain relative z-10 drop-shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
    />

    <!-- 3D shadow ellipse below the book -->
    <div
      class="absolute bottom-[-12px] left-1/2 -translate-x-1/2 z-0
             w-[100%] h-[50px]
             rounded-[50%]
             bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.25)_0%,_rgba(0,0,0,0.08)_40%,_transparent_70%)]
             blur-[2px]"
    ></div>
  </div>

  <p class="mt-6 font-body text-sm text-charcoal/40 italic">
    {BOOK_TITLE}
  </p>
</section>