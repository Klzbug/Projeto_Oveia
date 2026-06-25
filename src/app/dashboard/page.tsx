"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Layers, Eye, Calculator, Map, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import AcasaladorConsanguinidade from "@/components/AcasaladorConsanguinidade";
import DiagnosticoFamacha from "@/components/DiagnosticoFamacha";
import CalculadoraQueijo from "@/components/CalculadoraQueijo";
import MapaDiretorioProdutores from "@/components/MapaDiretorioProdutores";
import ThemeToggle from "@/components/ThemeToggle";

type TabKey = "acasalamento" | "famacha" | "calculadora" | "diretorio";

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
}

const CLO_REQUIREMENTS: ChecklistItem[] = [
  { id: "req1", text: "Registrar formalmente todo o rebanho em uma associação de registro genealógico oficial da raça.", category: "Zootecnia" },
  { id: "req2", text: "Firmar convênio e acordo técnico bilateral com a Embrapa Caprinos e Ovinos e com a associação credenciada (Caprileite/ACCOMIG).", category: "Administrativo" },
  { id: "req3", text: "Disponibilizar acesso integral e irrestrito aos dados de manejo reprodutivo, genealogia e histórico produtivo para os técnicos de campo.", category: "Dados" },
  { id: "req4", text: "Receber visitas periódicas de técnicos controladores credenciados em datas surpresa (visitas não programadas) para fiscalização de pesagem.", category: "Controle" },
  { id: "req5", text: "Fornecer alojamento e alimentação adequados para os técnicos controladores durante o período de controle na fazenda.", category: "Logística" },
  { id: "req6", text: "Cumprir estritamente as normativas de higiene e calibração de balanças estabelecidas pela delegação do Ministério da Agricultura (MAPA).", category: "Sanitário" }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("acasalamento");
  const [checkedReqs, setCheckedReqs] = useState<Record<string, boolean>>({
    req1: true,
    req2: true,
    req3: true,
  });
  const [showChecklist, setShowChecklist] = useState(false);

  const tabs = [
    { id: "acasalamento", label: "Acasalamento & Consanguinidade", icon: Layers, component: AcasaladorConsanguinidade },
    { id: "famacha", label: "Ficha & Diagnóstico FAMACHA©", icon: Eye, component: DiagnosticoFamacha },
    { id: "calculadora", label: "Calculadora & Curva de Lactação", icon: Calculator, component: CalculadoraQueijo },
    { id: "diretorio", label: "Diretório Capragene®", icon: Map, component: MapaDiretorioProdutores }
  ];

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || AcasaladorConsanguinidade;

  const handleToggleReq = (id: string) => {
    setCheckedReqs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const checkedCount = Object.values(checkedReqs).filter(Boolean).length;
  const isFullyHomologated = checkedCount === CLO_REQUIREMENTS.length;
  const progressPct = Math.round((checkedCount / CLO_REQUIREMENTS.length) * 100);

  return (
    <div className="flex-1 flex flex-col bg-la min-h-screen">
      {/* Header */}
      <header className="border-b border-areia bg-la sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 border border-areia rounded-full hover:bg-areia/40 flex items-center justify-center transition-colors text-cabrito"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="font-serif font-bold text-xl text-camurca tracking-tight">
              SGR <span className="text-pasto">Capri&Ovis</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-[10px] bg-pasto/10 text-pasto font-bold px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">
              Modo Acadêmico / Protótipo
            </span>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Banner Welcome */}
        <div className="bg-areia/40 border border-areia rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-[10px] text-pasto font-bold uppercase tracking-widest block">Sistema de Gerenciamento de Rebanhos</span>
            <h1 className="font-serif font-bold text-2xl lg:text-3xl text-camurca">
              Painel do Produtor
            </h1>
            <p className="text-xs text-cabrito/60 leading-normal">
              Gerencie a lactação, parentescos e sanidade do rebanho de ovinos e caprinos.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowChecklist(!showChecklist)}
              className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-all border ${
                isFullyHomologated 
                  ? "bg-emerald-600 border-emerald-700 text-la hover:bg-emerald-700" 
                  : "bg-la border-areia text-camurca hover:bg-areia/20"
              }`}
            >
              Homologação CLO: {progressPct}%
            </button>
            <Link
              href="/"
              className="text-xs font-bold text-cabrito/50 hover:text-cabrito transition-colors px-4 py-2.5 border border-transparent flex items-center gap-1"
            >
              Voltar para a Home
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* IMPROVEMENT 4: CLO HOMOLOGAÇÃO CHECKLIST */}
        {showChecklist && (
          <div className="bg-la border border-areia rounded-3xl p-6 shadow-sm animate-fade-in-up space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-camurca flex items-center gap-2">
                  Checklist: Homologação no Controle Leiteiro Oficial (CLO)
                </h3>
                <p className="text-xs text-cabrito/60 leading-relaxed mt-0.5">
                  Para participar das avaliações genéticas nacionais da Embrapa, sua propriedade precisa cumprir os seguintes requisitos zootécnicos e operacionais.
                </p>
              </div>
              <button 
                onClick={() => setShowChecklist(false)}
                className="text-xs font-bold text-cabrito/40 hover:text-cabrito"
              >
                Ocultar
              </button>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLO_REQUIREMENTS.map((req) => (
                <div 
                  key={req.id}
                  onClick={() => handleToggleReq(req.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                    checkedReqs[req.id]
                      ? "border-emerald-200 bg-emerald-50/45"
                      : "border-areia bg-la hover:bg-areia/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedReqs[req.id]}
                    onChange={() => {}} // handled by parent onClick
                    className="mt-1 h-4.5 w-4.5 rounded border-areia bg-la text-pasto focus:ring-pasto cursor-pointer"
                  />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-camurca tracking-widest block mb-0.5">
                      {req.category}
                    </span>
                    <p className="text-xs text-cabrito/85 leading-relaxed">{req.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Certificado */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 ${
              isFullyHomologated 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}>
              <div className="flex items-center gap-3">
                {isFullyHomologated ? (
                  <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                ) : (
                  <HelpCircle className="w-8 h-8 text-amber-600 flex-shrink-0 animate-pulse" />
                )}
                <div>
                  <h4 className="font-bold text-sm leading-tight">
                    {isFullyHomologated ? "Fazenda Homologada para o CLO" : "Homologação Pendente"}
                  </h4>
                  <p className="text-xs leading-normal opacity-90">
                    {isFullyHomologated 
                      ? "Todos os requisitos regulamentares foram preenchidos. Transmissão de avaliações genéticas ativada no SGR."
                      : `Falta preencher ${CLO_REQUIREMENTS.length - checkedCount} requisitos regulamentares para transmitir registros genéticos.`}
                  </p>
                </div>
              </div>
              <div className="font-serif font-bold text-lg px-4 py-1.5 rounded-xl bg-la border border-current/15">
                {checkedCount} / {CLO_REQUIREMENTS.length} Requisitos
              </div>
            </div>
          </div>
        )}

        {/* Horizontal Navigation Tabs */}
        <div className="border-b border-areia flex overflow-x-auto gap-2 pb-px scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`flex items-center gap-2.5 px-6 py-4 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? "border-pasto text-pasto font-bold bg-areia/10"
                    : "border-transparent text-cabrito/50 hover:text-cabrito hover:border-areia"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-pasto" : "text-cabrito/40"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Panel */}
        <div className="min-h-[400px]">
          <ActiveComponent />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-areia py-6 bg-la text-center text-xs text-cabrito/40">
        <p>SGR - Sistema de Gerenciamento de Rebanhos • Capri & Ovis Ovinocaprinocultura. SP, MG, RJ, ES.</p>
      </footer>
    </div>
  );
}
