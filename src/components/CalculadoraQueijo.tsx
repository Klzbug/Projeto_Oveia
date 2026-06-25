"use client";

import React, { useState } from "react";
import { Calculator, Beaker, Milk, ChevronRight, BarChart2, TrendingUp } from "lucide-react";

type BreedKey = "cabra" | "ovelha" | "vaca";
type OvinoBreedKey = "lacaune" | "eastFriesian";

interface YieldMetrics {
  fresco: number;
  curado: number;
  requeijao: number;
}

interface MilkComposition {
  gordura: number;
  proteina: number;
  lactose: number;
  solidos: number;
  cinzas: number;
  calcio: string;
  ph: string;
  densidade: string;
}

const YIELD_FACTORS: Record<BreedKey, YieldMetrics> = {
  vaca: { fresco: 5.0, curado: 10.0, requeijao: 6.0 },
  cabra: { fresco: 4.5, curado: 8.0, requeijao: 6.0 },
  ovelha: { fresco: 3.5, curado: 5.5, requeijao: 6.0 },
};

const COMPOSITIONS: Record<BreedKey, MilkComposition> = {
  cabra: {
    gordura: 3.65,
    proteina: 3.25,
    lactose: 4.25,
    solidos: 8.90,
    cinzas: 0.80,
    calcio: "Padrão Basal",
    ph: "6.50 - 6.80",
    densidade: "1.030 - 1.034",
  },
  ovelha: {
    gordura: 7.90,
    proteina: 6.03,
    lactose: 4.15,
    solidos: 12.00,
    cinzas: 0.93,
    calcio: "~180% do bovino",
    ph: "6.63 - 6.65",
    densidade: "1.036",
  },
  vaca: {
    gordura: 3.60,
    proteina: 3.20,
    lactose: 4.70,
    solidos: 9.00,
    cinzas: 0.70,
    calcio: "Padrão Basal",
    ph: "6.60 - 6.70",
    densidade: "1.028 - 1.032",
  },
};

export default function CalculadoraQueijo() {
  const [subTab, setSubTab] = useState<"yield" | "curve">("yield");
  
  // States for Yield Tab
  const [volume, setVolume] = useState<number>(100);
  const [selectedBreed, setSelectedBreed] = useState<BreedKey>("ovelha");

  // States for Curve Tab
  const [del, setDel] = useState<number>(60); // Dias em Lactação
  const [ovinoBreed, setOvinoBreed] = useState<OvinoBreedKey>("lacaune");

  // Yield calculations
  const factors = YIELD_FACTORS[selectedBreed];
  const comp = COMPOSITIONS[selectedBreed];
  const frescoKg = (volume / factors.fresco).toFixed(2);
  const curadoKg = (volume / factors.curado).toFixed(2);
  const requeijaoCopos = Math.floor(volume / factors.requeijao);

  // Lactation Curve formulas (Page 5 of Research PDF)
  // Ascending phase (DEL 1 to 30)
  // Decline phase (DEL 30+):
  // Lacaune: PL = 2.03 - 0.08 * (DEL - 30)
  // East Friesian: PL = 1.42 - 0.02 * (DEL - 30)
  const getPredictedYield = (breed: OvinoBreedKey, targetDel: number): number => {
    if (targetDel <= 30) {
      const peakVal = breed === "lacaune" ? 2.03 : 1.42;
      const startVal = breed === "lacaune" ? 1.20 : 1.00;
      return startVal + (peakVal - startVal) * (targetDel / 30);
    } else {
      const delDiff = targetDel - 30;
      if (breed === "lacaune") {
        return Math.max(0.1, 2.03 - 0.08 * delDiff);
      } else {
        return Math.max(0.1, 1.42 - 0.02 * delDiff);
      }
    }
  };

  const currentYield = getPredictedYield(ovinoBreed, del);
  
  // Specific details for Lacaune vs East Friesian
  const curveDetails = {
    lacaune: {
      name: "Raça Lacaune",
      fatPct: 6.86,
      protPct: 4.93,
      fatGrams: (currentYield * 6.86 * 10).toFixed(1),
      protGrams: (currentYield * 4.93 * 10).toFixed(1),
      avgYield: "1.67 kg/dia",
      maxYield: "Até 3.00 L/dia",
      milkingSpeed: "Rápida descida, baixo volume residual.",
      equation: "PL = 2.03 - 0.08 * DEL (pós-pico)"
    },
    eastFriesian: {
      name: "Raça East Friesian",
      fatPct: 7.31,
      protPct: 5.18,
      fatGrams: (currentYield * 7.31 * 10).toFixed(1),
      protGrams: (currentYield * 5.18 * 10).toFixed(1),
      avgYield: "1.35 kg/dia",
      maxYield: "Até 4.00 L/dia",
      milkingSpeed: "Maior retenção, exige maior manejo de esgota.",
      equation: "PL = 1.42 - 0.02 * DEL (pós-pico)"
    }
  }[ovinoBreed];

  // SVG Chart data points generator (DEL from 0 to 200)
  const chartPoints = Array.from({ length: 21 }, (_, i) => {
    const xDel = i * 10;
    const yYield = getPredictedYield(ovinoBreed, xDel);
    // Scale X to 0-300, Y to 0-100 (Max yield 4.0 -> y=100)
    const svgX = (xDel / 200) * 300 + 40;
    const svgY = 160 - (yYield / 4.0) * 120;
    return { x: svgX, y: svgY, del: xDel, yieldVal: yYield };
  });

  const chartPath = chartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Selected point translation
  const selectedSvgX = (del / 200) * 300 + 40;
  const selectedSvgY = 160 - (currentYield / 4.0) * 120;

  return (
    <div className="bg-la rounded-3xl border border-areia shadow-sm p-6 lg:p-8 animate-fade-in-up">
      {/* Tab Switcher inside the calculator component */}
      <div className="flex border-b border-areia mb-6">
        <button
          onClick={() => setSubTab("yield")}
          className={`px-4 py-2 border-b-2 font-bold text-xs uppercase tracking-wider transition-all ${
            subTab === "yield"
              ? "border-pasto text-pasto"
              : "border-transparent text-cabrito/40 hover:text-cabrito"
          }`}
        >
          Rendimento Lácteo
        </button>
        <button
          onClick={() => setSubTab("curve")}
          className={`px-4 py-2 border-b-2 font-bold text-xs uppercase tracking-wider transition-all ${
            subTab === "curve"
              ? "border-pasto text-pasto"
              : "border-transparent text-cabrito/40 hover:text-cabrito"
          }`}
        >
          Simulador de Curva de Lactação
        </button>
      </div>

      {subTab === "yield" ? (
        // Tab 1: Rendimento Lácteo
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pasto/10 rounded-2xl flex items-center justify-center text-pasto">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-camurca">
                Calculadora de Rendimento Industrial
              </h3>
              <p className="text-xs text-cabrito/60">
                Estime a produção de queijos finos e subprodutos com base nos sólidos de cada leite.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-cabrito/60 uppercase mb-3">
                  1. Selecione a Origem do Leite
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["ovelha", "cabra", "vaca"] as BreedKey[]).map((breed) => (
                    <button
                      key={breed}
                      onClick={() => setSelectedBreed(breed)}
                      className={`py-4 px-3 rounded-2xl border text-center transition-all duration-300 ${
                        selectedBreed === breed
                          ? "border-pasto bg-pasto text-la shadow-sm font-bold scale-[1.02]"
                          : "border-areia bg-la text-cabrito/70 hover:border-broto hover:bg-areia/30"
                      }`}
                    >
                      <Milk className="w-6 h-6 mx-auto mb-2 opacity-80" />
                      <span className="block text-sm capitalize">{breed}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-cabrito/60 uppercase">
                    2. Volume de Leite Disponível
                  </label>
                  <span className="text-pasto font-bold font-serif text-lg">
                    {volume} Litros
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-areia rounded-lg appearance-none cursor-pointer accent-pasto"
                />
                <div className="flex justify-between text-[10px] text-cabrito/40 mt-1">
                  <span>10 L</span>
                  <span>500 L</span>
                  <span>1000 L</span>
                </div>
                
                {/* Input numérico alternativo */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs text-cabrito/60">Digitar valor:</span>
                  <input
                    type="number"
                    min="0"
                    value={volume}
                    onChange={(e) => setVolume(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-28 px-3 py-1.5 border border-areia bg-la rounded-xl text-center focus:outline-none focus:border-pasto text-sm text-cabrito"
                  />
                </div>
              </div>

              {/* Fatores de conversão */}
              <div className="bg-areia/40 border border-areia/60 rounded-2xl p-4">
                <h4 className="text-[10px] font-bold text-camurca uppercase tracking-wider mb-2">
                  Fatores de Conversão Utilizados
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs text-cabrito/70">
                  <div>
                    <span className="block text-cabrito/40 text-[10px]">Q. Fresco:</span>
                    <strong className="text-cabrito">{factors.fresco} L/kg</strong>
                  </div>
                  <div>
                    <span className="block text-cabrito/40 text-[10px]">Q. Curado:</span>
                    <strong className="text-cabrito">{factors.curado} L/kg</strong>
                  </div>
                  <div>
                    <span className="block text-cabrito/40 text-[10px]">Requeijão:</span>
                    <strong className="text-cabrito">{factors.requeijao} L/unid</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Results and Composition */}
            <div className="space-y-6">
              {/* Resultados de Rendimento */}
              <div className="bg-areia/50 border border-areia rounded-3xl p-6">
                <h4 className="text-sm font-semibold text-camurca mb-4 flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-pasto" />
                  Rendimento Estimado
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-areia">
                    <span className="text-sm text-cabrito/80">Queijo Fresco (Premium)</span>
                    <span className="font-serif font-bold text-xl text-pasto">{frescoKg} kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-areia">
                    <span className="text-sm text-cabrito/80">Queijo Curado (Nobre)</span>
                    <span className="font-serif font-bold text-xl text-camurca">{curadoKg} kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <span className="text-sm text-cabrito/80 block">Requeijão de Soro</span>
                      <span className="text-xs text-cabrito/40">(Copo de 300g como subproduto)</span>
                    </div>
                    <span className="font-serif font-bold text-xl text-milho">{requeijaoCopos} un.</span>
                  </div>
                </div>
              </div>

              {/* Ficha Nutricional do Leite */}
              <div className="border border-areia rounded-3xl p-6 bg-la">
                <h4 className="text-sm font-semibold text-camurca mb-3 capitalize">
                  Ficha Físico-Química: Leite de {selectedBreed}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-areia/30 rounded-xl">
                    <span className="block text-[10px] text-cabrito/40 uppercase font-bold">Gordura</span>
                    <span className="text-sm font-bold text-cabrito">{comp.gordura}%</span>
                  </div>
                  <div className="p-2.5 bg-areia/30 rounded-xl">
                    <span className="block text-[10px] text-cabrito/40 uppercase font-bold">Proteína</span>
                    <span className="text-sm font-bold text-cabrito">{comp.proteina}%</span>
                  </div>
                  <div className="p-2.5 bg-areia/30 rounded-xl">
                    <span className="block text-[10px] text-cabrito/40 uppercase font-bold">Sólidos</span>
                    <span className="text-sm font-bold text-cabrito">{comp.solidos}%</span>
                  </div>
                  <div className="p-2.5 bg-areia/30 rounded-xl">
                    <span className="block text-[10px] text-cabrito/40 uppercase font-bold">Cálcio</span>
                    <span className="text-[11px] font-bold text-cabrito truncate block leading-tight">{comp.calcio}</span>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-cabrito/50 px-1">
                  <div className="flex justify-between">
                    <span>pH Médio:</span>
                    <strong className="text-cabrito">{comp.ph}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Densidade (15°C):</span>
                    <strong className="text-cabrito">{comp.densidade} g/cm³</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // IMPROVEMENT 3: TAB 2 - Simulador de Curva de Lactação
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-camurca/10 rounded-2xl flex items-center justify-center text-camurca">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-camurca">
                Simulador Fisiológico de Lactação (Ovinos)
              </h3>
              <p className="text-xs text-cabrito/60">
                Gere e plote curvas preditivas de produtividade com base nos coeficientes da pesquisa Embrapa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Control Panel */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Raça */}
              <div>
                <label className="block text-xs font-bold text-cabrito/60 uppercase mb-3">
                  1. Selecione a Raça Ovina
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOvinoBreed("lacaune")}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                      ovinoBreed === "lacaune"
                        ? "border-pasto bg-pasto text-la font-bold shadow-sm"
                        : "border-areia bg-la text-cabrito/70 hover:bg-areia/20"
                    }`}
                  >
                    Lacaune (LA)
                  </button>
                  <button
                    onClick={() => setOvinoBreed("eastFriesian")}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                      ovinoBreed === "eastFriesian"
                        ? "border-pasto bg-pasto text-la font-bold shadow-sm"
                        : "border-areia bg-la text-cabrito/70 hover:bg-areia/20"
                    }`}
                  >
                    East Friesian (EF)
                  </button>
                </div>
              </div>

              {/* Slider DEL */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-cabrito/60 uppercase">
                    2. Dias em Lactação (DEL)
                  </label>
                  <span className="text-pasto font-bold font-serif text-lg">
                    {del} dias
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={del}
                  onChange={(e) => setDel(Number(e.target.value))}
                  className="w-full h-2 bg-areia rounded-lg appearance-none cursor-pointer accent-pasto"
                />
                <div className="flex justify-between text-[10px] text-cabrito/40 mt-1">
                  <span>1 dia (Início)</span>
                  <span>100 dias</span>
                  <span>200 dias (Fim)</span>
                </div>
              </div>

              {/* Parâmetros Curva */}
              <div className="bg-areia/40 border border-areia rounded-2xl p-4 text-xs space-y-2">
                <span className="block text-[9px] uppercase font-bold text-camurca tracking-widest">
                  Equação & Parâmetros Fisiológicos
                </span>
                <div className="flex justify-between py-1 border-b border-areia/50 text-cabrito/70">
                  <span>Fórmula Utilizada:</span>
                  <code className="bg-la px-1.5 py-0.5 rounded text-pasto">{curveDetails.equation}</code>
                </div>
                <div className="flex justify-between py-1 border-b border-areia/50 text-cabrito/70">
                  <span>Produção Média:</span>
                  <strong className="text-cabrito">{curveDetails.avgYield}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-areia/50 text-cabrito/70">
                  <span>Pico Produtivo:</span>
                  <strong className="text-cabrito">{curveDetails.maxYield}</strong>
                </div>
                <div className="flex justify-between py-1 text-cabrito/70">
                  <span>Velocidade de Ordenha:</span>
                  <strong className="text-cabrito text-right max-w-[150px] leading-tight block">{curveDetails.milkingSpeed}</strong>
                </div>
              </div>

            </div>

            {/* Plot/Chart display */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* SVG Curve Plot */}
              <div className="bg-la border border-areia rounded-3xl p-5 relative shadow-sm">
                <h4 className="font-serif font-bold text-sm text-camurca mb-4 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-pasto" />
                  Gráfico de Curva de Lactação
                </h4>

                <div className="w-full aspect-[2/1] relative">
                  <svg viewBox="0 0 360 180" className="w-full h-full">
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="340" y2="20" stroke="#E6DFD3" strokeDasharray="3 3" />
                    <line x1="40" y1="80" x2="340" y2="80" stroke="#E6DFD3" strokeDasharray="3 3" />
                    <line x1="40" y1="140" x2="340" y2="140" stroke="#E6DFD3" strokeWidth="1" />
                    <line x1="40" y1="20" x2="40" y2="140" stroke="#E6DFD3" strokeWidth="1" />

                    {/* Chart labels */}
                    <text x="10" y="25" fill="#8B7355" className="text-[9px] font-mono">4.0L</text>
                    <text x="10" y="85" fill="#8B7355" className="text-[9px] font-mono">2.0L</text>
                    <text x="10" y="145" fill="#8B7355" className="text-[9px] font-mono">0.0L</text>
                    
                    <text x="40" y="160" fill="#8B7355" className="text-[9px] text-center font-mono">0d</text>
                    <text x="180" y="160" fill="#8B7355" className="text-[9px] text-center font-mono">100d</text>
                    <text x="320" y="160" fill="#8B7355" className="text-[9px] text-center font-mono">200d</text>

                    {/* Curve Line path */}
                    <path
                      d={chartPath}
                      fill="none"
                      stroke="#4A6B53"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Interactive dot */}
                    <circle
                      cx={selectedSvgX}
                      cy={selectedSvgY}
                      r="6.5"
                      fill="#D4A373"
                      stroke="#F9F6F0"
                      strokeWidth="2.5"
                      className="shadow"
                    />

                    {/* Current indicator line */}
                    <line
                      x1={selectedSvgX}
                      y1={selectedSvgY}
                      x2={selectedSvgX}
                      y2="140"
                      stroke="#D4A373"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  </svg>
                </div>
              </div>

              {/* Predicted Values Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-areia/40 border border-areia p-4 rounded-2xl text-center">
                  <span className="block text-[9px] text-cabrito/50 font-bold uppercase mb-1">Prod. Esperada</span>
                  <strong className="text-base text-pasto font-serif block">{currentYield.toFixed(2)} kg/dia</strong>
                </div>
                <div className="bg-areia/40 border border-areia p-4 rounded-2xl text-center">
                  <span className="block text-[9px] text-cabrito/50 font-bold uppercase mb-1">Gordura Estimada</span>
                  <strong className="text-base text-camurca font-serif block">{curveDetails.fatGrams} g/dia</strong>
                  <span className="text-[8px] text-cabrito/40 block">({curveDetails.fatPct}%)</span>
                </div>
                <div className="bg-areia/40 border border-areia p-4 rounded-2xl text-center">
                  <span className="block text-[9px] text-cabrito/50 font-bold uppercase mb-1">Proteína Est.</span>
                  <strong className="text-base text-camurca font-serif block">{curveDetails.protGrams} g/dia</strong>
                  <span className="text-[8px] text-cabrito/40 block">({curveDetails.protPct}%)</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
