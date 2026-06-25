"use client";

import React, { useState } from "react";
import { Eye, ShieldAlert, CheckCircle2, FlaskConical, Save, Activity, HeartCrack } from "lucide-react";

interface FamachaLevel {
  grade: number;
  color: string;
  borderColor: string;
  textColor: string;
  bgLight: string;
  status: "Saudável" | "Alerta" | "Crítico";
  description: string;
  treatmentRequired: boolean;
}

const FAMACHA_GRADES: FamachaLevel[] = [
  {
    grade: 1,
    color: "#E11D48",
    borderColor: "#BE123C",
    textColor: "text-rose-700",
    bgLight: "bg-rose-50",
    status: "Saudável",
    description: "Mucosa vermelha intensa. Ausência completa de anemia. Não requer tratamento químico.",
    treatmentRequired: false,
  },
  {
    grade: 2,
    color: "#FB7185",
    borderColor: "#F43F5E",
    textColor: "text-rose-500",
    bgLight: "bg-rose-50/50",
    status: "Saudável",
    description: "Mucosa vermelha clara. Animal saudável e resistente. Não requer tratamento químico.",
    treatmentRequired: false,
  },
  {
    grade: 3,
    color: "#FCA5A5",
    borderColor: "#F87171",
    textColor: "text-red-400",
    bgLight: "bg-red-50/30",
    status: "Alerta",
    description: "Mucosa rosa pálida. Limite da anemia. Recomenda-se tratamento seletivo dependendo do escore corporal.",
    treatmentRequired: true,
  },
  {
    grade: 4,
    color: "#FEE2E2",
    borderColor: "#FCA5A5",
    textColor: "text-red-500",
    bgLight: "bg-red-50",
    status: "Crítico",
    description: "Mucosa rosa esbranquiçada. Anemia severa instalada. Tratamento químico desverminante obrigatório.",
    treatmentRequired: true,
  },
  {
    grade: 5,
    color: "#FFFFFF",
    borderColor: "#FF0000",
    textColor: "text-red-700",
    bgLight: "bg-red-100/80",
    status: "Crítico",
    description: "Mucosa branca. Anemia muito severa, risco iminente de óbito. Tratamento de emergência obrigatório.",
    treatmentRequired: true,
  },
];

interface TreatmentDrug {
  name: string;
  dosePerKg: number; // mL por kg
  unit: string;
  notes: string;
}

const DRUGS: Record<"caprino" | "ovino", TreatmentDrug[]> = {
  caprino: [
    { name: "Moxidectina 0.2%", dosePerKg: 0.2, unit: "mL", notes: "Dose dobrada para caprinos devido ao metabolismo acelerado." },
    { name: "Levamisol 7.5%", dosePerKg: 0.15, unit: "mL", notes: "Aplicar via subcutânea com agulha curta." },
    { name: "Monepantel (Zolvix)", dosePerKg: 0.1, unit: "mL", notes: "Indicado para populações de helmintos multirresistentes." }
  ],
  ovino: [
    { name: "Ivermectina 1%", dosePerKg: 0.1, unit: "mL", notes: "Dose padrão recomendada pela Embrapa." },
    { name: "Albendazol 10%", dosePerKg: 0.075, unit: "mL", notes: "Não aplicar em ovelhas no primeiro terço da gestação." },
    { name: "Monepantel (Zolvix)", dosePerKg: 0.05, unit: "mL", notes: "Nova geração de anti-helmíntico altamente eficaz." }
  ]
};

interface DiagnosticoLog {
  id: string;
  animalName: string;
  species: "caprino" | "ovino";
  weight: number;
  grade: number;
  opg: number;
  genotype: "RR" | "RS" | "SS";
  drugUsed: string;
  dosage: string;
  date: string;
}

export default function DiagnosticoFamacha() {
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [animalName, setAnimalName] = useState<string>("Mel");
  const [species, setSpecies] = useState<"caprino" | "ovino">("caprino");
  const [weight, setWeight] = useState<number>(45);
  const [opg, setOpg] = useState<number>(450);
  const [selectedDrugIndex, setSelectedDrugIndex] = useState<number>(0);
  
  const [logs, setLogs] = useState<DiagnosticoLog[]>([
    { id: "DG01", animalName: "Hera", species: "caprino", weight: 52, grade: 4, opg: 1800, genotype: "SS", drugUsed: "Moxidectina 0.2%", dosage: "10.4 mL", date: "24/06/2026" }
  ]);

  const activeLevel = FAMACHA_GRADES.find(g => g.grade === selectedGrade)!;
  const activeDrugs = DRUGS[species];
  const activeDrug = activeDrugs[selectedDrugIndex] || activeDrugs[0];

  // Dosage calculation
  const calculatedDosage = (weight * activeDrug.dosePerKg).toFixed(1);

  // IMPROVEMENT 2: CLASSIFICAÇÃO IMUNOLÓGICA GENOTÍPICA
  // Resistentes (RR): OPG < 500 e FAMACHA 1 ou 2
  // Intermediários (RS): OPG 500 - 1500 ou FAMACHA 3
  // Susceptíveis (SS): OPG > 1500 ou FAMACHA 4 ou 5
  const genotype = (() => {
    if (selectedGrade >= 4 || opg > 1500) return "SS";
    if (selectedGrade === 3 || (opg >= 500 && opg <= 1500)) return "RS";
    return "RR";
  })();

  const handleSave = () => {
    const newLog: DiagnosticoLog = {
      id: "DG" + Date.now(),
      animalName: animalName || "Sem Nome",
      species,
      weight,
      grade: selectedGrade,
      opg,
      genotype,
      drugUsed: activeLevel.treatmentRequired ? activeDrug.name : "Nenhum (Saudável)",
      dosage: activeLevel.treatmentRequired ? `${calculatedDosage} ${activeDrug.unit}` : "0.0 mL",
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setLogs([newLog, ...logs]);
  };

  return (
    <div className="bg-la rounded-3xl border border-areia shadow-sm p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-milho/10 rounded-2xl flex items-center justify-center text-milho">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-2xl text-camurca">
            Ficha Clínica de Diagnóstico FAMACHA© & OPG
          </h3>
          <p className="text-sm text-cabrito/60">
            Associe o escore ocular FAMACHA© com a contagem OPG para classificar a resistência parasitária.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ficha do Animal & Entrada de Dados */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border border-areia rounded-3xl p-5 bg-areia/10 space-y-5">
            <h4 className="font-serif font-bold text-base text-camurca mb-2">
              Dados do Animal em Avaliação
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-cabrito/60 uppercase mb-1">Identificação / Nome</label>
                <input
                  type="text"
                  value={animalName}
                  onChange={(e) => setAnimalName(e.target.value)}
                  placeholder="Ex: Mel, Atena"
                  className="w-full px-3 py-2 border border-areia bg-la rounded-xl focus:outline-none focus:border-pasto text-sm text-cabrito"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cabrito/60 uppercase mb-1">Espécie</label>
                <select
                  value={species}
                  onChange={(e) => {
                    setSpecies(e.target.value as "caprino" | "ovino");
                    setSelectedDrugIndex(0);
                  }}
                  className="w-full px-3 py-2 border border-areia bg-la rounded-xl focus:outline-none focus:border-pasto text-sm text-cabrito"
                >
                  <option value="caprino">Caprino (Cabra/Bode)</option>
                  <option value="ovino">Ovino (Ovelha/Carneiro)</option>
                </select>
              </div>
            </div>

            {/* Slider de Peso */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-cabrito/60 uppercase mb-1">
                <span>Peso Estimado</span>
                <span className="text-pasto text-sm font-serif font-bold">{weight} kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-areia rounded-lg appearance-none cursor-pointer accent-pasto"
              />
              <div className="flex justify-between text-[10px] text-cabrito/40 mt-1">
                <span>5 kg</span>
                <span>60 kg</span>
                <span>120 kg</span>
              </div>
            </div>

            {/* IMPROVEMENT 2a: SLIDER DE OPG */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-cabrito/60 uppercase mb-1">
                <span>Contagem OPG (Ovos por Grama de Fezes)</span>
                <span className="text-camurca text-sm font-serif font-bold">{opg} OPG</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={opg}
                onChange={(e) => setOpg(Number(e.target.value))}
                className="w-full h-2 bg-areia rounded-lg appearance-none cursor-pointer accent-pasto"
              />
              <div className="flex justify-between text-[10px] text-cabrito/40 mt-1">
                <span>0 OPG (Livre)</span>
                <span>1500 OPG (Alerta)</span>
                <span>3000 OPG (Altíssimo)</span>
              </div>
            </div>
          </div>

          {/* Color Card Selector */}
          <div>
            <label className="block text-sm font-semibold text-cabrito mb-3">
              Selecione o Grau FAMACHA© (Coloração da Mucosa)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {FAMACHA_GRADES.map((level) => (
                <button
                  key={level.grade}
                  onClick={() => setSelectedGrade(level.grade)}
                  style={{
                    backgroundColor: level.color,
                    borderColor: selectedGrade === level.grade ? "#2C2A29" : level.borderColor,
                    borderWidth: selectedGrade === level.grade ? "4px" : "1px",
                  }}
                  className="h-16 rounded-2xl relative shadow-sm hover:scale-[1.03] transition-all flex flex-col items-center justify-center font-bold"
                >
                  <span
                    className={`text-sm ${
                      level.grade === 5 ? "text-red-600" : level.grade === 4 ? "text-red-700" : "text-la"
                    }`}
                  >
                    G{level.grade}
                  </span>
                  {selectedGrade === level.grade && (
                    <span className="absolute bottom-1 w-2 h-2 rounded-full bg-cabrito"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnosis & Treatment Screen */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card do Grau Selecionado */}
          <div className={`p-6 rounded-3xl border ${activeLevel.bgLight} border-areia shadow-sm`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-camurca">Laudo Clínico Sanitário</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                activeLevel.status === "Saudável"
                  ? "bg-emerald-100 text-emerald-800"
                  : activeLevel.status === "Alerta"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
              }`}>
                Grau {activeLevel.grade} • {activeLevel.status}
              </span>
            </div>
            
            <p className="text-sm text-cabrito/80 leading-relaxed mb-4">
              {activeLevel.description}
            </p>

            {/* IMPROVEMENT 2b: CARD DE CLASSIFICAÇÃO GENOTÍPICA DE RESISTÊNCIA */}
            <div className="mb-4 p-4 rounded-2xl border bg-la border-areia/80 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-camurca tracking-wider">
                  Genótipo Imunológico Estimado
                </span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                  genotype === "RR"
                    ? "bg-emerald-600 text-la"
                    : genotype === "RS"
                    ? "bg-amber-500 text-la"
                    : "bg-red-600 text-la"
                }`}>
                  {genotype === "RR" ? "Resistente (RR)" : genotype === "RS" ? "Intermediário (RS)" : "Susceptível (SS)"}
                </span>
              </div>
              <p className="text-[11px] text-cabrito/60 leading-normal">
                {genotype === "RR" && "Animal resistente. Herda capacidade inata de combater o estabelecimento de helmintos, mantendo mucosas coradas e OPG baixa."}
                {genotype === "RS" && "Animal tolerante. Exibe imunidade intermediária, necessitando de controle pontual e vermifugação estratégica apenas em picos de estresse."}
                {genotype === "SS" && "Animal susceptível. Incapaz de conter o ciclo parasitário, atuando como multiplicador de larvas nas pastagens. Deve-se avaliar descarte zootécnico."}
              </p>
            </div>

            {/* Seletor de Farmacoterapia */}
            {activeLevel.treatmentRequired || opg > 1000 ? (
              <div className="bg-la/80 rounded-2xl border border-areia p-4 space-y-4">
                <h5 className="text-xs font-bold uppercase text-camurca tracking-wider flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-pasto" />
                  Prescrição Farmacológica Sugerida
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-cabrito/50 uppercase mb-1">Medicamento</label>
                    <select
                      value={selectedDrugIndex}
                      onChange={(e) => setSelectedDrugIndex(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-areia bg-la rounded-xl focus:outline-none focus:border-pasto text-xs text-cabrito"
                    >
                      {activeDrugs.map((drug, index) => (
                        <option key={index} value={index}>
                          {drug.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-cabrito/50 uppercase mb-1">Dosagem Recomendada</span>
                    <strong className="text-base text-pasto font-serif block">
                      {calculatedDosage} {activeDrug.unit}
                    </strong>
                  </div>
                </div>

                <div className="text-[10px] text-cabrito/50 leading-relaxed pt-2 border-t border-areia">
                  <strong>Observação:</strong> {activeDrug.notes}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs text-emerald-700">
                  Animal saudável e carga parasitária controlada. Vermifugação química desnecessária no momento.
                </span>
              </div>
            )}

            <button
              onClick={handleSave}
              className="mt-5 w-full py-3 bg-pasto hover:bg-broto text-la hover:text-cabrito rounded-full font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Registro Clínico
            </button>
          </div>

        </div>

      </div>

      {/* History */}
      <div className="mt-8 border-t border-areia pt-6">
        <h4 className="font-serif font-bold text-lg text-camurca mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-pasto" />
          Histórico de Diagnósticos Sanitários
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-areia text-cabrito/40 font-bold uppercase">
                <th className="py-2.5">Identificação</th>
                <th className="py-2.5">Espécie</th>
                <th className="py-2.5">Peso</th>
                <th className="py-2.5 text-center">FAMACHA</th>
                <th className="py-2.5 text-center">OPG</th>
                <th className="py-2.5 text-center">Genótipo</th>
                <th className="py-2.5">Medicamento</th>
                <th className="py-2.5 text-center">Dosagem</th>
                <th className="py-2.5 text-right">Data</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-areia/40 hover:bg-areia/25 transition-colors">
                  <td className="py-3 font-semibold text-cabrito">{log.animalName}</td>
                  <td className="py-3 text-cabrito/60 capitalize">{log.species}</td>
                  <td className="py-3 text-cabrito/60">{log.weight} kg</td>
                  <td className="py-3 text-center font-bold">G{log.grade}</td>
                  <td className="py-3 text-center">{log.opg}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      log.genotype === "SS"
                        ? "bg-red-100 text-red-800"
                        : log.genotype === "RS"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {log.genotype}
                    </span>
                  </td>
                  <td className="py-3 text-cabrito/60">{log.drugUsed}</td>
                  <td className="py-3 text-center font-bold text-pasto">{log.dosage}</td>
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
