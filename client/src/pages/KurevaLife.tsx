import React from "react";
import { KurevaLifeApp } from "@/components/KurevaLifeApp";

export default function KurevaLife() {
  return (
    <div className="min-h-screen bg-[#F5F1E7] text-[#173A2E] selection:bg-[#D9FF2B] selection:text-[#0F3A2D]">
      <main id="contenido-principal">
        <KurevaLifeApp />
      </main>
    </div>
  );
}
