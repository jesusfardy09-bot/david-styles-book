import { MapPin, Phone, Clock, Instagram } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contacto" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Encuéntranos</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground">
            Contacto y <span className="text-gold">Ubicación</span>
          </h2>
          <div className="mt-4 mx-auto w-16 h-px bg-gold" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-background rounded-2xl border border-border p-6 shadow-card flex gap-5">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center flex-shrink-0 shadow-gold">
                <MapPin className="w-5 h-5 text-background" />
              </div>
              <div>
                <div className="font-display text-lg font-bold text-foreground mb-1">Dirección</div>
                <div className="text-muted-foreground">Isla San Francisco 2465</div>
                <div className="text-muted-foreground">Valdivia, Chile</div>
              </div>
            </div>

            <div className="bg-background rounded-2xl border border-border p-6 shadow-card flex gap-5">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center flex-shrink-0 shadow-gold">
                <Clock className="w-5 h-5 text-background" />
              </div>
              <div>
                <div className="font-display text-lg font-bold text-foreground mb-2">Horarios</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between gap-8">
                    <span className="text-muted-foreground">Lun – Mié</span>
                    <span className="text-foreground">09:00 – 19:00</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-muted-foreground">Jue – Vie</span>
                    <span className="text-foreground">09:00 – 20:00</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-muted-foreground">Sábado</span>
                    <span className="text-foreground">09:00 – 17:00</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-muted-foreground">Domingo</span>
                    <span className="text-destructive font-medium">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-2xl border border-border p-6 shadow-card flex gap-5">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center flex-shrink-0 shadow-gold">
                <Phone className="w-5 h-5 text-background" />
              </div>
              <div>
                <div className="font-display text-lg font-bold text-foreground mb-1">Contacto</div>
                <a href="tel:+56912345678" className="text-muted-foreground hover:text-gold transition-colors block">
                  +56 9 1234 5678
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mt-1">
                  <Instagram className="w-4 h-4" />
                  @davidminder.barber
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-card h-96 lg:h-full min-h-80">
            <iframe
              title="Ubicación David Minder Barbería"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3064.8!2d-73.2459!3d-39.8196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ5JzEwLjYiUyA3M8KwMTQnNDUuMiJX!5e0!3m2!1ses!2scl!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center py-12 rounded-2xl border border-gold-dim bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent" />
          <div className="relative z-10">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Listo para un nuevo look?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Agenda tu hora online en segundos y llega directo a la silla.
            </p>
            <button
              onClick={() => document.querySelector("#reservar")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 gradient-gold text-background font-bold rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-300 text-lg"
            >
              Agendar Ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
