import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BookingSection from "@/components/BookingSection";
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
        <BookingSection />
        <GallerySection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1 h-1 rounded-full bg-gold" />
          <span className="font-display text-sm font-semibold text-gold">David Minder</span>
          <div className="w-1 h-1 rounded-full bg-gold" />
        </div>
        <p className="text-xs text-muted-foreground">
          Isla San Francisco 2465, Valdivia · © {new Date().getFullYear()} David Minder Barbería
        </p>
      </footer>

      <ChatBot />
    </div>
  );
}
