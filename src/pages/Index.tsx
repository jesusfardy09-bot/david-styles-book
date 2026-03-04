import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import ChatBot from "@/components/ChatBot";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <GallerySection />
        <ContactSection />
      </main>

      <footer className="bg-surface border-t border-border py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1 h-1 rounded-full bg-gold" />
          <span className="font-display text-sm font-semibold text-gold">MINDER</span>
          <div className="w-1 h-1 rounded-full bg-gold" />
        </div>
        <p className="text-xs text-muted-foreground">
          Santiago, Chile · © {new Date().getFullYear()} Barbería David Minder
        </p>
      </footer>

      <ChatBot />
    </div>
  );
}
