<script>
  import { BOOK_TITLE } from "../lib/config.js";

  let name = "";
  let email = "";
  let phone = "";
  let comment = "";
  let submitted = false;

  function handleSubmit() {
    submitted = true;
    setTimeout(() => (submitted = false), 3000);
    name = "";
    email = "";
    phone = "";
    comment = "";
  }
</script>

<section class="w-full max-w-xl mx-auto px-6 pb-20">
  <h2 class="font-display text-xs tracking-[0.3em] uppercase text-charcoal text-center mb-10">
    Why would you read {BOOK_TITLE}?
  </h2>

  {#if submitted}
    <div class="text-center py-12 animate-fade-in">
      <p class="font-body text-charcoal text-lg">Thank you.</p>
      <p class="font-body text-charcoal/50 text-sm mt-1">We'll be in touch.</p>
    </div>
  {:else}
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col gap-2">
          <label for="name" class="font-display text-[11px] tracking-[0.2em] uppercase text-charcoal/60">
            Name
          </label>
          <input
            id="name"
            type="text"
            bind:value={name}
            required
            class="w-full bg-transparent border-b border-charcoal/20 pb-2 font-body text-sm text-charcoal outline-none
                   transition-colors duration-300
                   focus:border-rose
                   placeholder:text-charcoal/20"
            placeholder="Your name"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="email" class="font-display text-[11px] tracking-[0.2em] uppercase text-charcoal/60">
            Email
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            class="w-full bg-transparent border-b border-charcoal/20 pb-2 font-body text-sm text-charcoal outline-none
                   transition-colors duration-300
                   focus:border-rose
                   placeholder:text-charcoal/20"
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="phone" class="font-display text-[11px] tracking-[0.2em] uppercase text-charcoal/60">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          bind:value={phone}
          class="w-full bg-transparent border-b border-charcoal/20 pb-2 font-body text-sm text-charcoal outline-none
                 transition-colors duration-300
                 focus:border-rose
                 placeholder:text-charcoal/20"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="comment" class="font-display text-[11px] tracking-[0.2em] uppercase text-charcoal/60">
          Comment
        </label>
        <textarea
          id="comment"
          bind:value={comment}
          required
          rows="4"
          class="w-full bg-transparent border-b border-charcoal/20 pb-2 font-body text-sm text-charcoal outline-none resize-none
                 transition-colors duration-300
                 focus:border-rose
                 placeholder:text-charcoal/20"
          placeholder="What draws you to this book?"
        ></textarea>
      </div>

      <div class="pt-4 text-center">
        <button
          type="submit"
          class="inline-block font-display text-[11px] tracking-[0.25em] uppercase
                 px-10 py-3 border border-charcoal text-charcoal
                 transition-all duration-300
                 hover:bg-plum hover:border-plum hover:text-cream
                 active:scale-[0.97]"
        >
          Submit
        </button>
      </div>
    </form>
  {/if}
</section>