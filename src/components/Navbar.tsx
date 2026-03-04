import { useState, useEffect } from "react";
import { Scissors } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      if (!isHome) {
        navigate("/" + href);
        return;
      }
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  const navLinks = [
    { label: "Inicio", href: "#inicio" },
    { label: "Servicios", href: "#servicios" },
    { label: "Galería", href: "#galeria" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => handleNav("#inicio")} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300">
            <Scissors className="w-5 h-5 text-background" />
          </div>
          <div className="text-left">
            <div className="font-display font-bold text-lg text-gold leading-tight">MINDER</div>
            <div className="text-xs text-muted-foreground tracking-widest uppercase">Barbería</div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-sm tracking-wide text-muted-foreground hover:text-gold transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
            </button>
          ))}
          <button
            onClick={() => handleNav("/reservar")}
            className="px-5 py-2 gradient-gold text-background text-sm font-semibold rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
          >
            Reservar Hora
          </button>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-t border-border py-4 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left text-muted-foreground hover:text-gold transition-colors text-base py-1"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("/reservar")}
            className="w-full py-3 gradient-gold text-background font-semibold rounded-full shadow-gold"
          >
            Reservar Hora
          </button>
        </div>
      )}
    </nav>
  );
}
