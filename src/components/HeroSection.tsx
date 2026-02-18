import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-barbershop.jpg";

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollDown = () => {
    document.querySelector("#servicios")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/30 z-10" />

      {/* Gold vertical line accent */}
      <div className="absolute left-12 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold to-transparent z-20 hidden lg:block" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <p className="animate-fade-up delay-100 text-xs tracking-[0.4em] uppercase text-gold mb-6 font-medium">
          Barbería Premium · Valdivia
        </p>

        <h1 className="animate-fade-up delay-200 font-display text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-4">
          <span className="block text-foreground">David</span>
          <span className="gold-shimmer block">Minder</span>
        </h1>

        <p className="animate-fade-up delay-300 text-muted-foreground text-lg md:text-xl mt-6 mb-10 max-w-xl mx-auto font-light leading-relaxed">
          Arte y precisión en cada corte. Tu estilo, perfeccionado.
        </p>

        <div className="animate-fade-up delay-400 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => document.querySelector("#reservar")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 gradient-gold text-background font-semibold rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-300 text-base"
          >
            Agendar Hora
          </button>
          <button
            onClick={() => document.querySelector("#servicios")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 border border-gold-dim text-foreground font-medium rounded-full hover:border-gold hover:text-gold transition-all duration-300 text-base"
          >
            Ver Servicios
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fade-up delay-600 mt-16 flex justify-center gap-12">
          {[
            { value: "+500", label: "Clientes" },
            { value: "5★", label: "Calificación" },
            { value: "+8", label: "Años exp." },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-bold text-gold">{stat.value}</div>
              <div className="text-xs text-muted-foreground tracking-wide uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-muted-foreground hover:text-gold transition-colors animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
