import { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SCHEDULE = {
  Lunes: { open: "09:00", close: "19:00", slots: ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"] },
  Martes: { open: "09:00", close: "19:00", slots: ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"] },
  Miércoles: { open: "09:00", close: "19:00", slots: ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"] },
  Jueves: { open: "09:00", close: "20:00", slots: ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"] },
  Viernes: { open: "09:00", close: "20:00", slots: ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"] },
  Sábado: { open: "09:00", close: "17:00", slots: ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30"] },
  Domingo: null,
};

const SERVICES = [
  { label: "Corte de Pelo — $6.000", value: "Corte de Pelo" },
  { label: "Ceja — $1.000", value: "Ceja" },
  { label: "Corte + Ceja — $7.000", value: "Corte + Ceja" },
];

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function getTodayDateStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getDayName(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
}

export default function BookingSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    booking_date: "",
    booking_time: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedDay = form.booking_date ? getDayName(form.booking_date) : null;
  const daySchedule = selectedDay ? (SCHEDULE as any)[selectedDay] : null;
  const availableSlots = daySchedule?.slots ?? [];

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service || !form.booking_date || !form.booking_time) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("bookings").insert([form]);
      if (error) throw error;
      setSuccess(true);
      toast.success("¡Hora agendada con éxito! David se pondrá en contacto.");
    } catch (err: any) {
      toast.error("Error al agendar: " + (err.message || "Intenta de nuevo."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="reservar" className="py-24 bg-surface">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6 shadow-gold">
            <CheckCircle className="w-10 h-10 text-background" />
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            ¡Reserva Confirmada!
          </h2>
          <p className="text-muted-foreground mb-6">
            Tu hora ha sido agendada para el <strong className="text-foreground">{form.booking_date}</strong> a las <strong className="text-foreground">{form.booking_time}</strong>. David se pondrá en contacto contigo pronto.
          </p>
          <button
            onClick={() => { setSuccess(false); setForm({ name:"",phone:"",email:"",service:"",booking_date:"",booking_time:"",notes:"" }); }}
            className="px-6 py-3 gradient-gold text-background font-semibold rounded-full shadow-gold hover:opacity-90 transition-opacity"
          >
            Hacer otra reserva
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="reservar" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Agenda online</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground">
            Reserva tu <span className="text-gold">Hora</span>
          </h2>
          <div className="mt-4 mx-auto w-16 h-px bg-gold" />
          <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
            Elige el servicio, fecha y hora que más te acomode. Confirmación inmediata.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Schedule display */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Horarios</h3>
            <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-card">
              {DAYS.map((day) => {
                const sch = (SCHEDULE as any)[day];
                return (
                  <div key={day} className="flex items-center justify-between px-6 py-4 border-b border-border last:border-0">
                    <span className="font-medium text-foreground w-28">{day}</span>
                    {sch ? (
                      <span className="text-muted-foreground text-sm">
                        {sch.open} — {sch.close}
                      </span>
                    ) : (
                      <span className="text-destructive text-sm font-medium">Cerrado</span>
                    )}
                    {sch ? (
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Google Calendar note */}
            <div className="bg-background rounded-xl border border-gold-dim p-4 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-foreground mb-1">Sincronizado con Google Calendar</div>
                <div className="text-xs text-muted-foreground">
                  Tu reserva quedará registrada y David recibirá una notificación inmediata.
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-background rounded-2xl border border-border p-8 shadow-card space-y-5">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Datos de tu reserva</h3>

            {/* Name */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">
                Nombre *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full bg-surface rounded-xl border border-border text-foreground pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+56 9 XXXX XXXX"
                  className="w-full bg-surface rounded-xl border border-border text-foreground pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">
                Email (opcional)
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-surface rounded-xl border border-border text-foreground pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">
                Servicio *
              </label>
              <div className="relative">
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  value={form.service}
                  onChange={(e) => set("service", e.target.value)}
                  className="w-full bg-surface rounded-xl border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="">Selecciona un servicio</option>
                  {SERVICES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">
                Fecha *
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={form.booking_date}
                  onChange={(e) => { set("booking_date", e.target.value); set("booking_time", ""); }}
                  min={getTodayDateStr()}
                  className="w-full bg-surface rounded-xl border border-border text-foreground pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
              {selectedDay && !daySchedule && (
                <p className="mt-2 text-xs text-destructive">Los domingos estamos cerrados. Elige otro día.</p>
              )}
            </div>

            {/* Time slots */}
            {availableSlots.length > 0 && (
              <div>
                <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-3">
                  Hora *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot: string) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => set("booking_time", slot)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        form.booking_time === slot
                          ? "gradient-gold text-foreground shadow-gold"
                          : "bg-surface text-muted-foreground border border-border hover:border-gold hover:text-gold"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">
                Notas (opcional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Algún corte en mente, referencia, etc."
                rows={3}
                className="w-full bg-surface rounded-xl border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!!selectedDay && !daySchedule)}
              className="w-full py-4 gradient-gold text-background font-bold rounded-xl shadow-gold hover:opacity-90 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {loading ? "Agendando..." : "Confirmar Reserva"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
