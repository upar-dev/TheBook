<script>
  import photo1 from "../assets/generic1.jpg";
  import photo2 from "../assets/generic2.jpg";
  import photo3 from "../assets/generic3.jpg";

  const authors = [
    {
      name: "John Doe",
      photo: photo1,
      description:
        "Professor of Applied Sciences with over two decades of research in computational theory and systems design.",
    },
    {
      name: "Van Dam",
      photo: photo2,
      description:
        "Award-winning researcher specializing in human-computer interaction and pioneering work in interactive graphics.",
    },
    {
      name: "Sam Alt",
      photo: photo3,
      description:
        "Interdisciplinary scholar bridging the gap between technology and the humanities with a focus on ethical AI.",
    },
  ];
</script>

<section class="w-full max-w-4xl mx-auto px-6 py-16">
  <h2
    class="font-display text-xs tracking-[0.3em] uppercase text-charcoal text-center mb-14"
  >
    Meet the Authors
  </h2>

  <div class="flex flex-wrap justify-center gap-16">
    {#each authors as author}
      <div class="w-[220px] h-[256px] rounded-md overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] relative flex flex-col">
        <!-- Top section — secondary color (80px) -->
        <div class="h-[80px] shrink-0 bg-secondary"></div>

        <!-- Bottom section — anti-primary color -->
        <div class="flex-1 bg-anti flex flex-col items-center justify-end pb-5 px-4 pt-[44px]">
          <h3 class="font-display text-sm font-bold tracking-wide text-charcoal text-center">
            {author.name}
          </h3>
          <p class="font-body text-[11px] leading-relaxed text-charcoal/60 text-center mt-1.5">
            {author.description}
          </p>
        </div>

        <!-- Profile photo — centered on the border between sections -->
        <div class="absolute top-[80px] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            class="w-[72px] h-[72px] rounded-full overflow-hidden border-[3px] border-anti shadow-md"
          >
            <img
              src={author.photo}
              alt={author.name}
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>