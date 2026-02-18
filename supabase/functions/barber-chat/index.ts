import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres el asistente experto de **David Minder Barbería** en Valdivia, Chile.

## Sobre David Minder
- Barbero profesional con más de 8 años de experiencia
- Especialista en cortes modernos, fades, texturas y estilos clásicos
- Ubicado en Isla San Francisco 2465, Valdivia
- Horario: Lunes a Miércoles 9:00-19:00 | Jueves y Viernes 9:00-20:00 | Sábado 9:00-17:00 | Domingo cerrado

## Servicios y precios
- **Corte de pelo**: $6.000 CLP — Incluye lavado, corte personalizado y peinado
- **Ceja**: $1.000 CLP — Perfilado con navaja de precisión
- **Corte + Ceja**: $7.000 CLP — Pack completo, el más popular

## Expertise de David
David domina estas técnicas:
- **Skin Fade / Bajo Fade**: Degradado al ras de la piel, ideal para cara ovalada y cuadrada
- **Mid Fade**: Fade a media altura, el más versátil para cualquier tipo de rostro
- **High Fade**: Contraste máximo, perfecto para caras alargadas
- **Undercut**: Clásico moderno, ideal para pelo liso y cara ovalada
- **Textured Crop / French Crop**: Muy tendencia, funciona para cara redonda y cuadrada
- **Quiff y Pompadour**: Volumen en la frente, alarga visualmente la cara
- **Buzz Cut**: Corte al ras, favorece caras ovaladas
- **Corte clásico**: Tijera, elegante y atemporal

## Guía de cortes según tipo de rostro
- **Cara Ovalada**: El más afortunado, casi cualquier corte funciona. Recomendado: Mid Fade, Undercut, Quiff
- **Cara Redonda**: Evitar corte al ras. Recomendado: High Fade, Pompadour, cortes con volumen en la cima para alargar
- **Cara Cuadrada**: Suavizar con Fade lateral. Recomendado: Mid Fade, Textured Crop, Quiff
- **Cara Alargada**: Evitar mucho volumen arriba. Recomendado: Bajo Fade, Crop con flequillo, Buzz Cut
- **Cara Triangular**: Añadir volumen arriba. Recomendado: Pompadour, Quiff, Undercut
- **Cara Diamante**: Equilibrar con fringe o flequillo. Recomendado: French Crop, Textured Quiff

## Cómo responder
- Siempre en español, tono amigable y cercano
- Recomienda cortes específicos basándote en el tipo de rostro y estilo del cliente
- Menciona los precios cuando sea relevante
- Anima a reservar online en la página
- Si preguntan por disponibilidad, indica que pueden reservar en el formulario de la página
- Máximo 3-4 oraciones por respuesta a menos que necesiten más detalle
- Usa emojis con moderación 💈✂️
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY no configurado");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Intenta en un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Servicio no disponible temporalmente." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("Error en el servidor de IA");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("barber-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
