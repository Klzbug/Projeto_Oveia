"use client";

import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Heart, Info, Dna, GitFork } from "lucide-react";

interface Animal {
  id: string;
  tag: string;
  name: string;
  gender: "M" | "F";
  species: "caprino" | "ovino";
  breed: "Saanen" | "Alpina" | "Lacaune" | "East Friesian";
  ptaLeite: number; // Predicted Transmitting Ability (litros por lactação)
  age: string;
  photo: string;
  fatherTag?: string;
  motherTag?: string;
}

const MALES: Animal[] = [
  { id: "M01", tag: "REG-0112", name: "Hércules da Mantiqueira", gender: "M", species: "caprino", breed: "Saanen", ptaLeite: 185, age: "3 anos", photo: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-0001 (Apolo)", motherTag: "REG-0002 (Ceres)" },
  { id: "M02", tag: "REG-0854", name: "Thor do Vale Verde", gender: "M", species: "caprino", breed: "Alpina", ptaLeite: 142, age: "4 anos", photo: "https://images.unsplash.com/photo-1603203038676-e137452df3c8?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-0034 (Odin)", motherTag: "REG-0035 (Frigg)" },
  { id: "M03", tag: "REG-0991", name: "Ares do Caprigene", gender: "M", species: "caprino", breed: "Saanen", ptaLeite: 210, age: "2.5 anos", photo: "https://images.unsplash.com/photo-1533048347196-262953216292?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-0112 (Hércules)", motherTag: "REG-0050 (Athena)" }, // Filho de Hércules
  { id: "M04", tag: "REG-1209", name: "Lacaune Imperial", gender: "M", species: "ovino", breed: "Lacaune", ptaLeite: 260, age: "3.5 anos", photo: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-9900 (Lupin)", motherTag: "REG-9901 (Luna)" },
  { id: "M05", tag: "REG-1430", name: "Milchschaf Crown", gender: "M", species: "ovino", breed: "East Friesian", ptaLeite: 245, age: "2 anos", photo: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-9800 (Fritz)", motherTag: "REG-9801 (Marta)" }
];

const FEMALES: Animal[] = [
  { id: "F01", tag: "REG-2301", name: "Atena do Vale", gender: "F", species: "caprino", breed: "Saanen", ptaLeite: 120, age: "2 anos", photo: "https://images.unsplash.com/photo-1542841791-1925b02a2bf8?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-0005 (Chronos)", motherTag: "REG-0006 (Rhea)" },
  { id: "F02", tag: "REG-2845", name: "Hera da Mantiqueira", gender: "F", species: "caprino", breed: "Saanen", ptaLeite: 190, age: "3 anos", photo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-0112 (Hércules)", motherTag: "REG-0080 (Vênus)" }, // Filha de Hércules (M01)
  { id: "F03", tag: "REG-3122", name: "Cacau do Capril", gender: "F", species: "caprino", breed: "Alpina", ptaLeite: 135, age: "4 anos", photo: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-0034 (Odin)", motherTag: "REG-0099 (Freya)" },
  { id: "F04", tag: "REG-3401", name: "Lacaune Princesa", gender: "F", species: "ovino", breed: "Lacaune", ptaLeite: 220, age: "3 anos", photo: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-9902 (Max)", motherTag: "REG-9903 (Bela)" },
  { id: "F05", tag: "REG-3980", name: "Estrela do Sul", gender: "F", species: "ovino", breed: "East Friesian", ptaLeite: 215, age: "2.5 anos", photo: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=150&h=150&q=80", fatherTag: "REG-9802 (Hans)", motherTag: "REG-9803 (Heidi)" }
];

// Predefined kinship coefficient matrix (F)
const getKinshipF = (maleId: string, femaleId: string): number => {
  const m = MALES.find(x => x.id === maleId);
  const f = FEMALES.find(x => x.id === femaleId);
  if (!m || !f || m.species !== f.species) return 0;

  // Case 1: Hércules (M01) and Hera (F02) - Parent-offspring relationship (Hera is daughter of Hércules)
  if (maleId === "M01" && femaleId === "F02") return 0.25; 
  
  // Case 2: Ares (M03) and Hera (F02) - Half siblings (both sired by Hércules)
  if (maleId === "M03" && femaleId === "F02") return 0.125;

  // Case 3: Ares (M03) and Atena (F01) - Cousins / related
  if (maleId === "M03" && femaleId === "F01") return 0.0625;

  // Case 4: Lacaune Imperial (M04) and Lacaune Princesa (F04) - Distant related
  if (maleId === "M04" && femaleId === "F04") return 0.03125;

  return 0;
};

interface MatingLog {
  id: string;
  maleName: string;
  femaleName: string;
  breed: string;
  f: number;
  expectedPta: number;
  date: string;
}

export default function AcasaladorConsanguinidade() {
  const [selectedMaleId, setSelectedMaleId] = useState<string>("");
  const [selectedFemaleId, setSelectedFemaleId] = useState<string>("");
  const [speciesFilter, setSpeciesFilter] = useState<"todos" | "caprino" | "ovino">("todos");
  const [matingLogs, setMatingLogs] = useState<MatingLog[]>([
    { id: "L01", maleName: "Hércules da Mantiqueira", femaleName: "Cacau do Capril", breed: "Saanen x Alpina", f: 0, expectedPta: 160, date: "25/06/2026" }
  ]);
  const [showConfetti, setShowConfetti] = useState(false);

  const activeMale = MALES.find(m => m.id === selectedMaleId);
  const activeFemale = FEMALES.find(f => f.id === selectedFemaleId);

  const filteredMales = MALES.filter(m => speciesFilter === "todos" || m.species === speciesFilter);
  const filteredFemales = FEMALES.filter(f => speciesFilter === "todos" || f.species === speciesFilter);

  const F = activeMale && activeFemale ? getKinshipF(activeMale.id, activeFemale.id) : 0;
  
  // Offspring Expected PTA = (PTA_sire + PTA_dam) / 2
  const expectedPta = activeMale && activeFemale ? (activeMale.ptaLeite + activeFemale.ptaLeite) / 2 : 0;

  // Status computation
  let statusColor = "bg-stone-100 text-stone-600 border-stone-200";
  let statusTitle = "Aguardando Seleção";
  let statusDesc = "Selecione um macho e uma fêmea da mesma espécie para calcular a consanguinidade.";
  let statusBadge = "neutral";

  if (activeMale && activeFemale) {
    if (activeMale.species !== activeFemale.species) {
      statusColor = "bg-red-50 text-red-700 border-red-200";
      statusTitle = "Espécies Incompatíveis";
      statusDesc = "Não é possível acasalar caprinos (cabras) com ovinos (ovelhas).";
      statusBadge = "incompatible";
    } else if (F >= 0.125) {
      statusColor = "bg-red-50 text-red-700 border-red-200";
      statusTitle = "Risco de Consanguinidade Elevado (Crítico)";
      statusDesc = `O parentesco de ${(F * 100).toFixed(1)}% ultrapassa o limite de segurança de 12.5%. Cobertura bloqueada para evitar depressão por endogamia.`;
      statusBadge = "critical";
    } else if (F >= 0.0625) {
      statusColor = "bg-amber-50 text-amber-700 border-amber-200";
      statusTitle = "Atenção: Parentesco Próximo";
      statusDesc = `O parentesco de ${(F * 100).toFixed(2)}% exige monitoramento. Recomendado avaliar seletividade.`;
      statusBadge = "warning";
    } else {
      statusColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
      statusTitle = "Acasalamento Recomendado (Seguro)";
      statusDesc = `Parentesco seguro (${(F * 100).toFixed(2)}%). Acasalamento ideal para melhoramento genético.`;
      statusBadge = "safe";
    }
  }

  const handleConfirmMating = () => {
    if (!activeMale || !activeFemale || statusBadge === "critical" || statusBadge === "incompatible") return;

    const newLog: MatingLog = {
      id: "L" + Date.now(),
      maleName: activeMale.name,
      femaleName: activeFemale.name,
      breed: `${activeMale.breed} x ${activeFemale.breed}`,
      f: F,
      expectedPta,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setMatingLogs([newLog, ...matingLogs]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleReset = () => {
    setSelectedMaleId("");
    setSelectedFemaleId("");
  };

  return (
    <div className="bg-la rounded-3xl border border-areia shadow-sm p-6 lg:p-8 relative overflow-hidden animate-fade-in-up">
      {/* Confetti simulation overlay */}
      {showConfetti && (
        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none z-50 flex items-center justify-center animate-pulse">
          <div className="bg-emerald-600 text-la font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
            <Heart className="w-5 h-5 fill-la animate-bounce" />
            Cobertura Registrada com Sucesso!
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-camurca/10 rounded-2xl flex items-center justify-center text-camurca">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-2xl text-camurca">
              Painel de Acasalamento e Controle de Consanguinidade
            </h3>
            <p className="text-sm text-cabrito/60">
              Planeje coberturas e avalie o potencial genético esperado da descendência.
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex rounded-xl bg-areia/40 p-1 border border-areia self-start sm:self-center">
          {(["todos", "caprino", "ovino"] as const).map((spec) => (
            <button
              key={spec}
              onClick={() => {
                setSpeciesFilter(spec);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                speciesFilter === spec
                  ? "bg-la text-pasto shadow-sm"
                  : "text-cabrito/50 hover:text-cabrito"
              }`}
            >
              {spec === "todos" ? "Todos" : spec === "caprino" ? "Caprinos" : "Ovinos"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Animal Selection Lists */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Reprodutores (Males) */}
          <div className="border border-areia rounded-3xl p-5 bg-areia/10">
            <h4 className="font-serif font-bold text-lg text-camurca mb-4 flex items-center justify-between">
              <span>Reprodutores (Machos)</span>
              <span className="text-xs bg-areia px-2.5 py-1 rounded-full text-cabrito/70 font-sans">
                {filteredMales.length} ativos
              </span>
            </h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredMales.map((male) => (
                <div
                  key={male.id}
                  onClick={() => setSelectedMaleId(male.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedMaleId === male.id
                      ? "border-pasto bg-pasto/5 shadow-sm ring-1 ring-pasto"
                      : "border-areia bg-la hover:border-broto"
                  }`}
                >
                  <img
                    src={male.photo}
                    alt={male.name}
                    className="w-12 h-12 rounded-xl object-cover border border-areia"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-cabrito truncate">{male.name}</p>
                    <div className="flex items-center gap-2 text-xs text-cabrito/60">
                      <span>{male.breed}</span>
                      <span>•</span>
                      <span>PTA: <strong className="text-pasto">+{male.ptaLeite}L</strong></span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-areia px-2 py-0.5 rounded-md text-cabrito/60 uppercase font-mono font-bold">
                    {male.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Matrizes (Females) */}
          <div className="border border-areia rounded-3xl p-5 bg-areia/10">
            <h4 className="font-serif font-bold text-lg text-camurca mb-4 flex items-center justify-between">
              <span>Matrizes (Fêmeas)</span>
              <span className="text-xs bg-areia px-2.5 py-1 rounded-full text-cabrito/70 font-sans">
                {filteredFemales.length} ativas
              </span>
            </h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredFemales.map((female) => (
                <div
                  key={female.id}
                  onClick={() => setSelectedFemaleId(female.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedFemaleId === female.id
                      ? "border-pasto bg-pasto/5 shadow-sm ring-1 ring-pasto"
                      : "border-areia bg-la hover:border-broto"
                  }`}
                >
                  <img
                    src={female.photo}
                    alt={female.name}
                    className="w-12 h-12 rounded-xl object-cover border border-areia"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-cabrito truncate">{female.name}</p>
                    <div className="flex items-center gap-2 text-xs text-cabrito/60">
                      <span>{female.breed}</span>
                      <span>•</span>
                      <span>PTA: <strong className="text-pasto">+{female.ptaLeite}L</strong></span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-areia px-2 py-0.5 rounded-md text-cabrito/60 uppercase font-mono font-bold">
                    {female.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mating Analysis & Control Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="border border-areia rounded-3xl p-6 bg-areia/30 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-lg text-camurca mb-4 flex items-center gap-2">
                Simulador de Parentesco
              </h4>

              {/* Selected Pair Preview */}
              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="bg-la p-3 rounded-2xl border border-areia">
                  <span className="text-[10px] text-cabrito/40 uppercase font-bold block mb-1">Reprodutor</span>
                  {activeMale ? (
                    <>
                      <img src={activeMale.photo} className="w-10 h-10 rounded-full mx-auto object-cover border border-areia mb-1.5" />
                      <span className="text-xs font-bold text-cabrito block truncate">{activeMale.name}</span>
                      <span className="text-[9px] text-camurca block">{activeMale.breed}</span>
                    </>
                  ) : (
                    <span className="text-xs text-cabrito/40 block py-4">Não selecionado</span>
                  )}
                </div>

                <div className="bg-la p-3 rounded-2xl border border-areia">
                  <span className="text-[10px] text-cabrito/40 uppercase font-bold block mb-1">Matriz</span>
                  {activeFemale ? (
                    <>
                      <img src={activeFemale.photo} className="w-10 h-10 rounded-full mx-auto object-cover border border-areia mb-1.5" />
                      <span className="text-xs font-bold text-cabrito block truncate">{activeFemale.name}</span>
                      <span className="text-[9px] text-camurca block">{activeFemale.breed}</span>
                    </>
                  ) : (
                    <span className="text-xs text-cabrito/40 block py-4">Não selecionada</span>
                  )}
                </div>
              </div>

              {/* Traffic Light Status Screen */}
              <div className={`p-4 rounded-2xl border ${statusColor} transition-all duration-300 mb-4`}>
                <div className="flex items-start gap-2.5">
                  {statusBadge === "safe" && <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                  {statusBadge === "warning" && <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />}
                  {statusBadge === "critical" && <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 animate-bounce" />}
                  {statusBadge === "incompatible" && <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />}
                  {statusBadge === "neutral" && <Info className="w-5 h-5 text-stone-500 flex-shrink-0" />}
                  
                  <div>
                    <h5 className="font-bold text-xs leading-tight mb-1">{statusTitle}</h5>
                    <p className="text-[11px] leading-normal opacity-90">{statusDesc}</p>
                  </div>
                </div>

                {activeMale && activeFemale && activeMale.species === activeFemale.species && (
                  <div className="mt-3 pt-2.5 border-t border-current/10 flex justify-between items-center text-xs">
                    <span>Consanguinidade (F):</span>
                    <strong className="text-base font-serif">
                      {(F * 100).toFixed(2)}%
                    </strong>
                  </div>
                )}
              </div>

              {/* IMPROVEMENT 1: OFFSPRING GENETIC PTA ESTIMATOR & PEDIGREE */}
              {activeMale && activeFemale && activeMale.species === activeFemale.species && (
                <div className="bg-la/60 border border-areia rounded-2xl p-4 space-y-3.5">
                  {/* Predição Genética */}
                  <div>
                    <span className="text-[9px] uppercase font-bold text-camurca tracking-widest block mb-1">
                      Predição Zootécnica (F1)
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-cabrito/60">PTA Leite Estimado:</span>
                      <strong className="text-xs text-pasto font-bold">
                        +{expectedPta.toFixed(1)} L/lactação
                      </strong>
                    </div>
                    <p className="text-[9px] text-cabrito/40 leading-snug mt-1">
                      Média aritmética das avaliações genéticas dos progenitores (PTA do pai e PTA da mãe).
                    </p>
                  </div>

                  {/* Genealogia básica */}
                  <div className="pt-2 border-t border-areia">
                    <span className="text-[9px] uppercase font-bold text-camurca tracking-widest block mb-1.5 flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-broto" />
                      Genealogia Próxima
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-cabrito/60">
                      <div>
                        <strong className="block text-cabrito/80 font-bold">Pai ({activeMale.tag})</strong>
                        <span>P: {activeMale.fatherTag || "N/D"}</span>
                        <span className="block">M: {activeMale.motherTag || "N/D"}</span>
                      </div>
                      <div>
                        <strong className="block text-cabrito/80 font-bold">Mãe ({activeFemale.tag})</strong>
                        <span>P: {activeFemale.fatherTag || "N/D"}</span>
                        <span className="block">M: {activeFemale.motherTag || "N/D"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mating Confirm Button */}
            <div className="mt-5 space-y-2">
              <button
                onClick={handleConfirmMating}
                disabled={!activeMale || !activeFemale || statusBadge === "critical" || statusBadge === "incompatible"}
                className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm ${
                  activeMale && activeFemale && statusBadge !== "critical" && statusBadge !== "incompatible"
                    ? "bg-pasto hover:bg-broto text-la hover:text-cabrito"
                    : "bg-stone-300 text-stone-500 cursor-not-allowed shadow-none"
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
                Confirmar Cobertura
              </button>
              <button
                onClick={handleReset}
                className="w-full py-1.5 bg-transparent text-[11px] font-semibold text-cabrito/50 hover:text-cabrito transition-colors text-center"
              >
                Limpar Seleção
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* History Logs */}
      <div className="mt-8 border-t border-areia pt-6">
        <h4 className="font-serif font-bold text-lg text-camurca mb-4">
          Histórico de Coberturas Registradas
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-areia text-cabrito/40 font-bold uppercase">
                <th className="py-2.5">Reprodutor</th>
                <th className="py-2.5">Matriz</th>
                <th className="py-2.5">Cruzamento</th>
                <th className="py-2.5 text-center">F (%)</th>
                <th className="py-2.5 text-center">PTA Cria</th>
                <th className="py-2.5 text-right">Data</th>
              </tr>
            </thead>
            <tbody>
              {matingLogs.map((log) => (
                <tr key={log.id} className="border-b border-areia/40 hover:bg-areia/25 transition-colors">
                  <td className="py-3 font-semibold text-cabrito">{log.maleName}</td>
                  <td className="py-3 font-semibold text-cabrito">{log.femaleName}</td>
                  <td className="py-3 text-cabrito/60">{log.breed}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full font-bold font-mono ${
                      log.f >= 0.125
                        ? "bg-red-100 text-red-800"
                        : log.f >= 0.0625
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {(log.f * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 text-center font-bold text-pasto">+{log.expectedPta.toFixed(1)} L</td>
                  <td className="py-3 text-right text-cabrito/50">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
