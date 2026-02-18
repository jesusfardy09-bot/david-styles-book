import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Scissors, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy el asistente de **David Minder Barbería** 💈\n\nPuedo ayudarte a elegir el corte perfecto según tu tipo de rostro y estilo, o resolver cualquier duda sobre nuestros servicios.\n\n¿Qué tipo de rostro tienes o qué look buscas?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/barber-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Demasiadas solicitudes. Intenta en un momento.");
          setLoading(false);
          return;
        }
        throw new Error("Error del servidor");
      }

      // Stream reading
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      let buffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed.choices?.[0]?.delta?.content;
            if (chunk) {
              assistantText += chunk;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantText };
                return updated;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err: any) {
      toast.error("Error al enviar: " + (err.message || "Intenta de nuevo."));
      setMessages((prev) => prev.filter((_, i) => i < prev.length - 1));
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-gold shadow-gold flex items-center justify-center hover:scale-110 transition-all duration-300 ${open ? "rotate-90" : ""}`}
      >
        {open ? (
          <X className="w-6 h-6 text-background" />
        ) : (
          <MessageSquare className="w-6 h-6 text-background" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] h-[520px] bg-background border border-border rounded-2xl shadow-card flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="gradient-gold px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-background/20 rounded-full flex items-center justify-center">
              <Scissors className="w-4 h-4 text-background" />
            </div>
            <div>
              <div className="font-display font-bold text-background text-sm">
                Asistente David Minder
              </div>
              <div className="text-background/70 text-xs">Experto en cortes y estilos</div>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full gradient-gold flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <Scissors className="w-3 h-3 text-background" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full gradient-gold flex items-center justify-center mr-2">
                  <Scissors className="w-3 h-3 text-background" />
                </div>
                <div className="chat-bubble-bot px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border flex-shrink-0">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Pregunta sobre cortes..."
                className="flex-1 bg-surface rounded-xl border border-border text-foreground px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
              >
                <Send className="w-4 h-4 text-background" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Potenciado por IA · David Minder Barbería
            </p>
          </div>
        </div>
      )}
    </>
  );
}
