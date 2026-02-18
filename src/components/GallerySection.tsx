import barberCutting from "@/assets/barber-cutting.jpg";
import haircutFade from "@/assets/haircut-fade.jpg";
import barberShave from "@/assets/barber-shave.jpg";
import heroBg from "@/assets/hero-barbershop.jpg";

const images = [
  { src: heroBg, alt: "Barbería David Minder interior", span: "col-span-2" },
  { src: barberCutting, alt: "Corte profesional", span: "col-span-1" },
  { src: haircutFade, alt: "Fade moderno", span: "col-span-1" },
  { src: barberShave, alt: "Afeitado con navaja", span: "col-span-2" },
];

export default function GallerySection() {
  return (
    <section id="galeria" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Nuestro trabajo</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground">
            La <span className="text-gold">Galería</span>
          </h2>
          <div className="mt-4 mx-auto w-16 h-px bg-gold" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`${img.span} group relative overflow-hidden rounded-2xl aspect-video cursor-pointer`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-foreground font-display text-lg font-semibold bg-background/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-dim">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
