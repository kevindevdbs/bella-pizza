"use client";

import { useCallback, useEffect, useRef } from "react";

const NEW_ORDER_MESSAGE = "Um Novo Pedido Chegou";

function getPreferredFemaleVoice(voices: SpeechSynthesisVoice[]) {
  const byNamePriority = [
    "microsoft francisca",
    "francisca",
    "google português do brasil",
    "google portugues do brasil",
  ];

  const ptBrVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("pt-br"),
  );

  for (const preferredName of byNamePriority) {
    const voice = ptBrVoices.find((item) =>
      item.name.toLowerCase().includes(preferredName),
    );

    if (voice) {
      return voice;
    }
  }

  const femaleHintVoice = ptBrVoices.find((voice) => {
    const name = voice.name.toLowerCase();
    return (
      name.includes("female") ||
      name.includes("mulher") ||
      name.includes("femin") ||
      name.includes("maria") ||
      name.includes("helena")
    );
  });

  if (femaleHintVoice) {
    return femaleHintVoice;
  }

  return ptBrVoices[0] ?? voices[0] ?? null;
}

export function useOrderSpeechAlert() {
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const speakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakSequenceRef = useRef(0);

  const loadPreferredVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      return;
    }

    preferredVoiceRef.current = getPreferredFemaleVoice(voices);
  }, []);

  const speak = useCallback(
    (message: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        console.warn("SpeechSynthesis não está disponível neste navegador.");
        return;
      }

      const speechSynthesis = window.speechSynthesis;

      if (speakTimerRef.current) {
        clearTimeout(speakTimerRef.current);
      }

      // Reinicia a fila para garantir que frases repetidas sejam sempre anunciadas.
      speechSynthesis.cancel();
      speechSynthesis.resume();

      speakTimerRef.current = setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "pt-BR";
        // Pequena variação técnica evita que alguns navegadores suprimam mensagens idênticas.
        utterance.rate = speakSequenceRef.current % 2 === 0 ? 0.95 : 0.96;
        utterance.pitch = 1;
        utterance.volume = 1;

        if (!preferredVoiceRef.current) {
          loadPreferredVoice();
        }

        if (preferredVoiceRef.current) {
          utterance.voice = preferredVoiceRef.current;
        }

        speechSynthesis.speak(utterance);
        speakSequenceRef.current += 1;
      }, 120);
    },
    [loadPreferredVoice],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    loadPreferredVoice();

    const handleVoicesChanged = () => loadPreferredVoice();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged,
    );

    return () => {
      if (speakTimerRef.current) {
        clearTimeout(speakTimerRef.current);
      }

      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged,
      );
      window.speechSynthesis.cancel();
    };
  }, [loadPreferredVoice]);

  const speakNewOrderAlert = useCallback(() => {
    speak(NEW_ORDER_MESSAGE);
  }, [speak]);

  const speakUpdatedOrderAlert = useCallback(
    (table: number) => {
      speak(`Pedido da mesa ${table} alterado`);
    },
    [speak],
  );

  const speakDeletedOrderAlert = useCallback(
    (table: number) => {
      speak(`Pedido da mesa ${table} cancelado`);
    },
    [speak],
  );

  return {
    speakNewOrderAlert,
    speakUpdatedOrderAlert,
    speakDeletedOrderAlert,
    speak,
  };
}
