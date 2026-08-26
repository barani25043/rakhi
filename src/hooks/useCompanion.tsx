import { useState, createContext, useContext } from "react";
import type { ReactNode } from "react";

export type CompanionMode = "shinchan" | "minions" | "duo";

interface CompanionContextType {
  companion: CompanionMode;
  setCompanion: (mode: CompanionMode) => void;
  toggleNextCompanion: () => void;
}

export const CompanionContext = createContext<CompanionContextType>({
  companion: "duo",
  setCompanion: () => {},
  toggleNextCompanion: () => {},
});

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [companion, setCompanion] = useState<CompanionMode>("duo");

  const toggleNextCompanion = () => {
    setCompanion((prev) => {
      if (prev === "shinchan") return "minions";
      if (prev === "minions") return "duo";
      return "shinchan";
    });
  };

  return (
    <CompanionContext.Provider
      value={{
        companion,
        setCompanion,
        toggleNextCompanion,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  return useContext(CompanionContext);
}
