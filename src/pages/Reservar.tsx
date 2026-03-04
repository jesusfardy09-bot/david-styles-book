import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle, Scissors, Eye, ArrowLeft, ArrowRight, User, Phone, Mail, FileText, Clock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const N8N_URL = "https://hook.us2.make.com/hu492418bz13dsi6lra99c13w325la88";

const SERVICES = [
  {
    id: "corte",
    label: "Corte de Pelo",
    price: "$6.000",
    duration: "45 min",
    icon: Scissors,
    description: "Corte profesional con estilo personalizado",
  },
  {
    id: "ceja",
    label: "Diseño de Cejas",
    price: "$1.000",
    duration: "20 min",
    icon: Eye,
    description: "Perfilado y diseño de cejas",
  },
  {
    id: "corte_ceja",
    label: "Corte + Cejas",
    price: "$7.000",
    duration: "60 min",
    icon: Scissors,
    description: "Combo completo: corte de pelo y diseño de cejas",
  },
];

function generateSlots(): string[] {
  const slots: string[] = [];
  // 9:00 to 12:15 (last 45-min block starts 12:15 ends 13:00)
  for (let h = 9; h < 13; h++) {
    for (let m = 0; m < 60; m += 45) {
      const end = h * 60 + m + 45;
      if (end <= 13 * 60) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
  }
  // 14:00 to 18:15 (last block ends at 19:00)
  for (let h = 14; h < 19; h++) {
    for (let m = 0; m < 60; m += 45) {
      const end = h * 60 + m + 45;
      if (end <= 19 * 60) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
  }
  return slots;
}

const TIME_SLOTS = generateSlots();

function getNext14Days(): { dateStr: string; label: string; dayName: string }[] {
  const days: { dateStr: string; label: string; dayName: string }[] = [];
  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const today = new Date();
  for (let i = 1; i <= 21 && days.length < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow === 0) continue; // skip Sunday
    days.push({
      dateStr: d.toISOString().split("T")[0],
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      dayName: dayNames[dow],
    });
  }
  return days;
}

export default function Reservar() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const selectedService = SERVICES.find((s) => s.id === service);
  const availableDays = getNext14Days();
  const selectedDay = availableDays.find((d) => d.dateStr === date);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleConfirm = async () => {
    if (!form.name || !form.phone) {
      toast.error("Por favor completa nombre y teléfono.");
      return;
    }
    setLoading(true);
    try {
      // Save to database
      const { data, error } = await supabase.from("bookings").insert([{
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        service: selectedService?.label || "",
        booking_date: date,
        booking_time: time,
        notes: form.notes || null,
      }]).select("id").single();

      if (error) throw error;

      // Send to n8n webhook
      try {
        const res = await fetch(N8N_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email || "",
            date,
            time,
            service,
            notes: form.notes || "",
          }),
        });
        const result = await res.json();
        if (!result.success) {
          console.warn("n8n webhook did not return success");
        }
      } catch (webhookErr) {
        console.warn("n8n webhook failed, booking saved locally:", webhookErr);
      }

      setBookingId(data.id.slice(0, 8).toUpperCase());
      setStep(5);
      toast.success("¡Reserva confirmada!");
    } catch (err: any) {
      toast.error("Error al agendar: " + (err.message || "Intenta de nuevo."));
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep(1);
    setService("");
    setDate("");
    setTime("");
    setForm({ name: "", phone: "", email: "", notes: "" });
    setBookingId("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        {/* Progress */}
        {step < 5 && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    s === step
                      ? "gradient-gold text-background shadow-gold"
                      : s < step
                      ? "bg-gold/20 text-gold"
                      : "bg-surface border border-border text-muted-foreground"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 4 && (
                  <div className={`w-8 h-px ${s < step ? "bg-gold" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Service */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
              Elige tu <span className="text-gold">Servicio</span>
            </h2>
            <p className="text-muted-foreground text-center mb-8">Selecciona el servicio que necesitas</p>

            <div className="space-y-4">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setService(s.id); setStep(2); }}
                  className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-0.5 ${
                    service === s.id
                      ? "border-gold bg-gold/10 shadow-gold"
                      : "border-border bg-surface hover:border-gold-dim"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center shadow-gold">
                        <s.icon className="w-5 h-5 text-background" />
                      </div>
                      <div>
                        <div className="font-display text-lg font-bold text-foreground">{s.label}</div>
                        <div className="text-sm text-muted-foreground">{s.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl font-bold text-gold">{s.price}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> {s.duration}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
              Elige el <span className="text-gold">Día</span>
            </h2>
            <p className="text-muted-foreground text-center mb-8">Próximos 14 días disponibles (Lun-Sáb)</p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableDays.map((d) => (
                <button
                  key={d.dateStr}
                  onClick={() => { setDate(d.dateStr); setTime(""); setStep(3); }}
                  className={`p-4 rounded-xl border text-center transition-all duration-200 hover:scale-[1.03] ${
                    date === d.dateStr
                      ? "border-gold bg-gold/10 shadow-gold"
                      : "border-border bg-surface hover:border-gold-dim"
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">{d.dayName}</div>
                  <div className="font-display text-lg font-bold text-foreground">{d.label}</div>
                </button>
              ))}
            </div>

            <button onClick={() => setStep(1)} className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Cambiar servicio
            </button>
          </div>
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
              Elige la <span className="text-gold">Hora</span>
            </h2>
            <p className="text-muted-foreground text-center mb-2">
              {selectedDay?.dayName} {selectedDay?.label} · {selectedService?.label}
            </p>
            <p className="text-xs text-muted-foreground text-center mb-8">Bloques de 45 minutos · Sin atención de 13:00 a 14:00</p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => { setTime(slot); setStep(4); }}
                  className={`py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.03] ${
                    time === slot
                      ? "gradient-gold text-background shadow-gold"
                      : "bg-surface border border-border text-muted-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Cambiar día
            </button>
          </div>
        )}

        {/* Step 4: Form */}
        {step === 4 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
              Tus <span className="text-gold">Datos</span>
            </h2>
            <p className="text-muted-foreground text-center mb-8">Completa tu información para confirmar</p>

            {/* Summary card */}
            <div className="bg-surface rounded-xl border border-gold-dim p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Servicio:</span>
                <span className="text-gold font-semibold">{selectedService?.label} — {selectedService?.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Fecha:</span>
                <span className="text-foreground">{selectedDay?.dayName} {selectedDay?.label}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Hora:</span>
                <span className="text-foreground">{time}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Nombre completo *</label>
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

              <div>
                <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Teléfono *</label>
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

              <div>
                <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Email (opcional)</label>
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

              <div>
                <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-2">Notas para el barbero (opcional)</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Algún corte en mente, referencia, etc."
                    rows={3}
                    className="w-full bg-surface rounded-xl border border-border text-foreground pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full mt-6 py-4 gradient-gold text-background font-bold rounded-xl shadow-gold hover:opacity-90 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
            >
              {loading ? "Confirmando..." : (
                <>Confirmar Reserva <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <button onClick={() => setStep(3)} className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Cambiar hora
            </button>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="animate-fade-up text-center">
            <div className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6 shadow-gold">
              <CheckCircle className="w-10 h-10 text-background" />
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              ¡Reserva Confirmada!
            </h2>

            <div className="bg-surface rounded-xl border border-gold-dim p-6 mb-6 text-left max-w-sm mx-auto">
              <div className="text-center mb-4">
                <span className="text-xs tracking-wider uppercase text-muted-foreground">ID de reserva</span>
                <div className="font-display text-2xl font-bold text-gold mt-1">#{bookingId}</div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio</span>
                  <span className="text-foreground font-medium">{selectedService?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio</span>
                  <span className="text-gold font-bold">{selectedService?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha</span>
                  <span className="text-foreground">{selectedDay?.dayName} {selectedDay?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora</span>
                  <span className="text-foreground">{time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente</span>
                  <span className="text-foreground">{form.name}</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-6">
              David se pondrá en contacto contigo para confirmar. ¡Gracias!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={resetAll}
                className="px-6 py-3 gradient-gold text-background font-semibold rounded-full shadow-gold hover:opacity-90 transition-opacity"
              >
                Hacer otra reserva
              </button>
              <a
                href="/"
                className="px-6 py-3 border border-border text-foreground font-medium rounded-full hover:border-gold hover:text-gold transition-all"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
