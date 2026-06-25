"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Phone, Mail, Award, CheckCircle2, Globe, Sparkles } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  owner: string;
  city: string;
  uf: "SP" | "MG" | "RJ" | "ES";
  breeds: string[];
  style: "photo" | "seal" | "summary" | "standard" | "premium_seal" | "business" | "bucks" | "awards";
  phone?: string;
  email?: string;
  address?: string;
  photoUrl?: string;
  bucksList?: string[];
  websiteUrl?: string;
  mapCoords: { x: number; y: number }; // Coordinates on our SVG map (viewBox 0 0 400 300)
}

const PARTNERS: Partner[] = [
  {
    id: "P01",
    name: "Fazenda Paraíso da Mantiqueira",
    owner: "Marilia Aparecida Pasin P. Rangel",
    city: "Guaratinguetá",
    uf: "SP",
    breeds: ["Saanen", "Alpina"],
    style: "photo",
    email: "contato@paraisodamantiqueira.com.br",
    photoUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80",
    mapCoords: { x: 120, y: 220 }
  },
  {
    id: "P02",
    name: "Fazenda Santa Rita",
    owner: "Maria Pia S. L. Mattos de Paiva",
    city: "Florestal",
    uf: "MG",
    breeds: ["Alpina", "Saanen"],
    style: "seal",
    phone: "(31) 98877-6655",
    address: "Estrada Real, Km 12, Zona Rural - Florestal/MG",
    mapCoords: { x: 190, y: 130 }
  },
  {
    id: "P03",
    name: "Capril Caprivama",
    owner: "Pedro Paulo Vasconcellos Leite",
    city: "Alfenas",
    uf: "MG",
    breeds: ["Saanen"],
    style: "summary",
    phone: "(35) 99911-2233",
    mapCoords: { x: 150, y: 170 }
  },
  {
    id: "P04",
    name: "Capril da Bocaina",
    owner: "Jarbas da Costa Vidal",
    city: "Tabuleiro",
    uf: "MG",
    breeds: ["Alpina"],
    style: "standard",
    mapCoords: { x: 210, y: 180 }
  },
  {
    id: "P05",
    name: "Fazenda RDR",
    owner: "Ricardo Duarte Ribeiro",
    city: "Muriaé",
    uf: "MG",
    breeds: ["Saanen"],
    style: "standard",
    mapCoords: { x: 260, y: 170 }
  },
  {
    id: "P06",
    name: "Capril Vitória Régia",
    owner: "Marcela Silva Ribeiro",
    city: "Resende",
    uf: "RJ",
    breeds: ["Saanen"],
    style: "premium_seal",
    mapCoords: { x: 220, y: 220 }
  },
  {
    id: "P07",
    name: "Capril Inli",
    owner: "José Maria Moreira Santos",
    city: "Ouro Fino",
    uf: "MG",
    breeds: ["Saanen"],
    style: "standard",
    mapCoords: { x: 130, y: 180 }
  },
  {
    id: "P08",
    name: "Rancho Visoleta (Capril SH)",
    owner: "Paulo Shalders",
    city: "Cachoeiro do Itapemirim",
    uf: "ES",
    breeds: ["Alpina"],
    style: "standard",
    mapCoords: { x: 320, y: 160 }
  },
  {
    id: "P09",
    name: "Minas Cabra Ltda",
    owner: "Luiz Antônio Ribeiro",
    city: "São Gotardo",
    uf: "MG",
    breeds: ["Saanen"],
    style: "business",
    email: "diretoria@minascabra.com.br",
    mapCoords: { x: 130, y: 100 }
  },
  {
    id: "P10",
    name: "Capril Goulart",
    owner: "Flávio Goulart de Oliveira",
    city: "Matipó",
    uf: "MG",
    breeds: ["Alpina"],
    style: "standard",
    mapCoords: { x: 250, y: 130 }
  },
  {
    id: "P11",
    name: "Capril Chácara Santa Clara",
    owner: "Caetano Geraldo de Souza",
    city: "Coronel Pacheco",
    uf: "MG",
    breeds: ["Saanen"],
    style: "standard",
    mapCoords: { x: 220, y: 190 }
  },
  {
    id: "P12",
    name: "Capril da Ladeira",
    owner: "Eduardo Morici Ladeira",
    city: "Rio Novo",
    uf: "MG",
    breeds: ["Alpina"],
    style: "standard",
    mapCoords: { x: 230, y: 180 }
  },
  {
    id: "P13",
    name: "Capril Primavera",
    owner: "G. C. M. Sarmento / R. Sarmento",
    city: "Rio Novo",
    uf: "MG",
    breeds: ["Saanen"],
    style: "bucks",
    bucksList: ["Hércules (Saanen)", "Thor (Alpina)", "Zeus (Saanen)"],
    mapCoords: { x: 240, y: 180 }
  },
  {
    id: "P14",
    name: "Capril Triqueda",
    owner: "Marcélio Teixeira",
    city: "Coronel Pacheco",
    uf: "MG",
    breeds: ["Alpina"],
    style: "standard",
    mapCoords: { x: 215, y: 195 }
  },
  {
    id: "P15",
    name: "Capril Ipelândia",
    owner: "Manoel Moura Evangelista",
    city: "Suzano",
    uf: "SP",
    breeds: ["Saanen"],
    style: "standard",
    mapCoords: { x: 90, y: 240 }
  },
  {
    id: "P16",
    name: "Capril Jacomé",
    owner: "Gilberto Camargos Couto",
    city: "Coronel Pacheco",
    uf: "MG",
    breeds: ["Alpina"],
    style: "standard",
    mapCoords: { x: 225, y: 185 }
  },
  {
    id: "P17",
    name: "Capril da Prata",
    owner: "Charles de Oliveira Paula",
    city: "Muriaé",
    uf: "MG",
    breeds: ["Saanen"],
    style: "standard",
    mapCoords: { x: 270, y: 165 }
  },
  {
    id: "P18",
    name: "Capril Rancho das Vertentes",
    owner: "Edson da Costa Cardoso",
    city: "Barbacena",
    uf: "MG",
    breeds: ["Saanen", "Alpina"],
    style: "awards",
    websiteUrl: "https://ranchodasvertentes.com.br",
    mapCoords: { x: 200, y: 170 }
  },
  {
    id: "P19",
    name: "Capril Olhos D'Minas",
    owner: "José Eduardo Teixeira Mendes",
    city: "Inconfidentes",
    uf: "MG",
    breeds: ["Saanen"],
    style: "standard",
    mapCoords: { x: 140, y: 190 }
  }
];

export default function MapaDiretorioProdutores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUf, setSelectedUf] = useState<"todos" | "SP" | "MG" | "RJ" | "ES">("todos");
  const [selectedBreed, setSelectedBreed] = useState<"todas" | "Saanen" | "Alpina">("todas");
  const [hoveredPartnerId, setHoveredPartnerId] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

  // Filters partners
  const filteredPartners = useMemo(() => {
    return PARTNERS.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.owner.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUf = selectedUf === "todos" || partner.uf === selectedUf;
      const matchesBreed = selectedBreed === "todas" || partner.breeds.includes(selectedBreed);

      return matchesSearch && matchesUf && matchesBreed;
    });
  }, [searchQuery, selectedUf, selectedBreed]);

  const activePartner = PARTNERS.find((p) => p.id === selectedPartnerId);

  return (
    <div className="bg-la rounded-3xl border border-areia shadow-sm p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-pasto/10 rounded-2xl flex items-center justify-center text-pasto">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-2xl text-camurca">
            Diretório de Produtores Parceiros (Capragene®)
          </h3>
          <p className="text-sm text-cabrito/60">
            Encontre fazendas parceiras registradas no Programa de Melhoramento Genético.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Filtros e Diretório */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Barra de Busca e Filtros rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Campo de Busca */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-cabrito/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Buscar por fazenda, cidade ou proprietário..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-areia bg-la rounded-xl text-sm focus:outline-none focus:border-pasto text-cabrito placeholder-cabrito/40"
              />
            </div>

            {/* Raça */}
            <select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value as any)}
              className="px-3 py-2.5 border border-areia bg-la rounded-xl text-sm focus:outline-none focus:border-pasto text-cabrito"
            >
              <option value="todas">Todas as Raças</option>
              <option value="Saanen">Saanen</option>
              <option value="Alpina">Alpina</option>
            </select>
          </div>

          {/* Quick UF Filter Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-cabrito/50 font-bold uppercase mr-1">Filtrar Estado:</span>
            {(["todos", "MG", "SP", "RJ", "ES"] as const).map((uf) => (
              <button
                key={uf}
                onClick={() => setSelectedUf(uf)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition-all ${
                  selectedUf === uf
                    ? "bg-pasto text-la shadow-sm"
                    : "bg-areia/40 text-cabrito/60 hover:bg-areia/80"
                }`}
              >
                {uf === "todos" ? "Todos" : uf}
              </button>
            ))}
            <span className="ml-auto text-xs text-cabrito/40 font-bold">
              {filteredPartners.length} encontrados
            </span>
          </div>

          {/* Partner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredPartners.map((partner) => {
              const isSelected = selectedPartnerId === partner.id;
              
              return (
                <div
                  key={partner.id}
                  onClick={() => {
                    setSelectedPartnerId(partner.id);
                    // Center or select pin
                  }}
                  onMouseEnter={() => setHoveredPartnerId(partner.id)}
                  onMouseLeave={() => setHoveredPartnerId(null)}
                  className={`border rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-pasto bg-pasto/5 ring-1 ring-pasto shadow-sm"
                      : hoveredPartnerId === partner.id
                      ? "border-broto bg-areia/10"
                      : "border-areia bg-la"
                  }`}
                >
                  <div>
                    {/* Header: Name and UF Tag */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="font-serif font-bold text-sm text-cabrito leading-tight hover:text-pasto transition-colors">
                        {partner.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-areia text-camurca">
                        {partner.uf}
                      </span>
                    </div>

                    <p className="text-[11px] text-cabrito/50 mb-3">
                      Proprietário: <strong className="text-cabrito/70">{partner.owner}</strong>
                    </p>

                    {/* RENDERING SPECIALIZED STYLES */}
                    {partner.style === "photo" && (
                      <div className="mt-1 mb-3 rounded-lg overflow-hidden border border-areia h-24 relative">
                        <img src={partner.photoUrl} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-cabrito/80 to-transparent p-2 text-[10px] text-la font-semibold">
                          Foto da Propriedade
                        </div>
                      </div>
                    )}

                    {partner.style === "seal" && (
                      <div className="mb-3 p-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-[10px] text-emerald-800 font-bold uppercase">Participante Oficial CLO</span>
                      </div>
                    )}

                    {partner.style === "premium_seal" && (
                      <div className="mb-3 p-2 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span className="text-[10px] text-amber-800 font-bold uppercase">Selo Genética Premium</span>
                      </div>
                    )}

                    {partner.style === "bucks" && partner.bucksList && (
                      <div className="mb-3 bg-areia/40 rounded-xl p-2.5">
                        <span className="text-[9px] font-bold uppercase text-camurca tracking-wider block mb-1">Reprodutores de Sêmen:</span>
                        <div className="flex flex-wrap gap-1">
                          {partner.bucksList.map((b, i) => (
                            <span key={i} className="bg-la text-cabrito/75 text-[9px] px-1.5 py-0.5 rounded border border-areia">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {partner.style === "awards" && (
                      <div className="mb-3 p-2 bg-gradient-to-r from-milho/10 to-transparent border-l-4 border-milho rounded flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-milho flex-shrink-0" />
                        <span className="text-[10px] text-camurca font-bold">Laticínios Finos Premiados</span>
                      </div>
                    )}

                    {/* Info specifics based on layout */}
                    <div className="space-y-1 text-xs text-cabrito/70">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-broto flex-shrink-0" />
                        <span className="truncate">{partner.city} - {partner.uf}</span>
                      </div>
                      {partner.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-broto flex-shrink-0" />
                          <span>{partner.phone}</span>
                        </div>
                      )}
                      {partner.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-broto flex-shrink-0" />
                          <span className="truncate text-pasto hover:underline">{partner.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Breeds footer */}
                  <div className="mt-4 pt-2.5 border-t border-areia/60 flex items-center justify-between text-[10px]">
                    <span className="text-cabrito/40 uppercase font-bold">Raças Criadas:</span>
                    <div className="flex gap-1">
                      {partner.breeds.map((b) => (
                        <span key={b} className="bg-pasto/10 text-pasto px-2 py-0.5 rounded-full font-semibold">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Interactive Stylized Map */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="border border-areia rounded-3xl p-5 bg-areia/20 flex flex-col justify-between h-full">
            <div>
              <h4 className="font-serif font-bold text-lg text-camurca mb-2">
                Mapa de Localização Georreferenciada
              </h4>
              <p className="text-xs text-cabrito/50 mb-4">
                Clique nos estados ou pins para filtrar fazendas.
              </p>

              {/* Styled SVG Map of Southeast Brazil */}
              <div className="bg-la rounded-2xl border border-areia/70 p-2 overflow-hidden aspect-[4/3] flex items-center justify-center relative shadow-inner">
                
                {/* SVG MAP DRAWING */}
                <svg viewBox="0 0 400 300" className="w-full h-full select-none">
                  <defs>
                    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2C2A29" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#2C2A29" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* SCHEMATIC STATES */}
                  {/* Minas Gerais (MG) */}
                  <path
                    d="M 120 40 L 260 30 L 310 90 L 330 160 L 260 210 L 210 190 L 150 190 L 100 130 Z"
                    fill={selectedUf === "MG" ? "#A3B19B" : "#E6DFD3"}
                    stroke="#8B7355"
                    strokeWidth="2"
                    className="transition-colors duration-300 cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedUf(selectedUf === "MG" ? "todos" : "MG")}
                  />
                  <text x="180" y="90" fill="#8B7355" className="font-serif font-bold text-xs pointer-events-none select-none">
                    Minas Gerais
                  </text>

                  {/* São Paulo (SP) */}
                  <path
                    d="M 50 160 L 100 130 L 150 190 L 210 190 L 190 230 L 120 270 L 60 230 Z"
                    fill={selectedUf === "SP" ? "#A3B19B" : "#E6DFD3"}
                    stroke="#8B7355"
                    strokeWidth="2"
                    className="transition-colors duration-300 cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedUf(selectedUf === "SP" ? "todos" : "SP")}
                  />
                  <text x="90" y="210" fill="#8B7355" className="font-serif font-bold text-xs pointer-events-none select-none">
                    São Paulo
                  </text>

                  {/* Rio de Janeiro (RJ) */}
                  <path
                    d="M 210 190 L 260 210 L 300 240 L 290 260 L 210 230 Z"
                    fill={selectedUf === "RJ" ? "#A3B19B" : "#E6DFD3"}
                    stroke="#8B7355"
                    strokeWidth="2"
                    className="transition-colors duration-300 cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedUf(selectedUf === "RJ" ? "todos" : "RJ")}
                  />
                  <text x="250" y="235" fill="#8B7355" className="font-serif font-bold text-[10px] pointer-events-none select-none">
                    Rio de Janeiro
                  </text>

                  {/* Espírito Santo (ES) */}
                  <path
                    d="M 310 90 L 360 110 L 340 190 L 330 160 Z"
                    fill={selectedUf === "ES" ? "#A3B19B" : "#E6DFD3"}
                    stroke="#8B7355"
                    strokeWidth="2"
                    className="transition-colors duration-300 cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedUf(selectedUf === "ES" ? "todos" : "ES")}
                  />
                  <text x="325" y="130" fill="#8B7355" className="font-serif font-bold text-[10px] pointer-events-none select-none" transform="rotate(30, 325, 130)">
                    Espírito Santo
                  </text>

                  {/* PARTNER DOT PINS */}
                  {filteredPartners.map((partner) => {
                    const isHovered = hoveredPartnerId === partner.id;
                    const isSelected = selectedPartnerId === partner.id;
                    
                    return (
                      <g
                        key={partner.id}
                        onMouseEnter={() => setHoveredPartnerId(partner.id)}
                        onMouseLeave={() => setHoveredPartnerId(null)}
                        onClick={() => setSelectedPartnerId(partner.id)}
                        className="cursor-pointer"
                      >
                        {/* Ping radar effect on hover/select */}
                        {(isHovered || isSelected) && (
                          <circle
                            cx={partner.mapCoords.x}
                            cy={partner.mapCoords.y}
                            r="12"
                            fill={isSelected ? "#4A6B53" : "#D4A373"}
                            opacity="0.3"
                            className="animate-ping"
                          />
                        )}
                        
                        {/* Pin Dot */}
                        <circle
                          cx={partner.mapCoords.x}
                          cy={partner.mapCoords.y}
                          r={isSelected ? 6 : isHovered ? 5 : 3.5}
                          fill={isSelected ? "#4A6B53" : isHovered ? "#D4A373" : "#2C2A29"}
                          stroke="#F9F6F0"
                          strokeWidth="1"
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Clear selection floating badge */}
                {(selectedUf !== "todos" || selectedBreed !== "todas" || searchQuery !== "") && (
                  <button
                    onClick={() => {
                      setSelectedUf("todos");
                      setSelectedBreed("todas");
                      setSearchQuery("");
                      setSelectedPartnerId(null);
                    }}
                    className="absolute bottom-3 right-3 bg-cabrito text-la text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-pasto transition-colors shadow"
                  >
                    Resetar Filtros
                  </button>
                )}
              </div>
            </div>

            {/* Detailed Selected Partner Card */}
            {activePartner ? (
              <div className="mt-4 p-4 border border-pasto/40 bg-pasto/5 rounded-2xl space-y-2 animate-fade-in-up">
                <span className="text-[9px] uppercase font-bold text-pasto tracking-wider block">Parceiro Selecionado</span>
                <h5 className="font-serif font-bold text-sm text-cabrito leading-tight">
                  {activePartner.name}
                </h5>
                <p className="text-[10px] text-cabrito/60">
                  Cidade: <strong className="text-cabrito">{activePartner.city} - {activePartner.uf}</strong>
                </p>
                <div className="text-xs text-cabrito/70 space-y-1">
                  <p><strong>Proprietário:</strong> {activePartner.owner}</p>
                  <p><strong>Raças Criadas:</strong> {activePartner.breeds.join(" e ")}</p>
                </div>
                {activePartner.style === "awards" && activePartner.websiteUrl && (
                  <a
                    href={activePartner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-pasto hover:text-broto font-semibold inline-flex items-center gap-1 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Acessar Loja e Portfólio
                  </a>
                )}
              </div>
            ) : (
              <div className="mt-4 p-4 border border-areia bg-areia/10 border-dashed rounded-2xl text-center text-xs text-cabrito/40">
                Selecione uma fazenda parceira para ver informações detalhadas e links de contato.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
