<script>
  import Header from "./lib/Header.svelte";
  import BookCanvas from "./lib/BookCanvas.svelte";
  import ContactForm from "./lib/ContactForm.svelte";
  import Footer from "./lib/Footer.svelte";
</script>

<div class="min-h-screen bg-cream flex flex-col font-body text-charcoal antialiased">
  <Header />

  <main class="flex-1 flex flex-col items-center">
    <BookCanvas />
    <ContactForm />

    
  </main>

  <Footer />
</div>
