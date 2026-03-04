import { Scissors, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import barberCutting from "@/assets/barber-cutting.jpg";
import haircutFade from "@/assets/haircut-fade.jpg";
import barberShave from "@/assets/barber-shave.jpg";

const services = [
  {
    icon: Scissors,
    title: "Corte de Pelo",
    description: "Corte profesional con estilo personalizado",
    price: "6.000",
    duration: "45 min",
    image: barberCutting,
  },
  {
    icon: Eye,
    title: "Diseño de Cejas",
    description: "Perfilado y diseño de cejas",
    price: "1.000",
    duration: "20 min",
    image: haircutFade,
  },
  {
    icon: Scissors,
    title: "Corte + Cejas",
    description: "Combo completo: corte de pelo y diseño de cejas",
    price: "7.000",
    duration: "60 min",
    image: barberShave,
    badge: "Popular",
  },
];

export default function ServicesSection() {
  const navigate = useNavigate();

  return (
    <section id="servicios" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Lo que ofrecemos</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground">
            Nuestros <span className="text-gold">Servicios</span>
          </h2>
          <div className="mt-4 mx-auto w-16 h-px bg-gold" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative bg-surface rounded-2xl overflow-hidden shadow-card border border-border hover:border-gold-dim transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                {service.badge && (
                  <span className="absolute top-4 right-4 px-3 py-1 gradient-gold text-background text-xs font-bold rounded-full shadow-gold">
                    {service.badge}
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-raised border border-gold-dim flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                      <service.icon className="w-4 h-4 text-gold group-hover:text-background transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">{service.title}</h3>
                      <span className="text-xs text-muted-foreground">{service.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-black text-gold">{service.price}</div>
                    <div className="text-xs text-muted-foreground">CLP</div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>

                <button
                  onClick={() => navigate("/reservar")}
                  className="mt-5 w-full py-3 border border-gold-dim text-gold text-sm font-medium rounded-xl hover:gradient-gold hover:text-background hover:border-transparent hover:shadow-gold transition-all duration-300"
                >
                  Reservar ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
