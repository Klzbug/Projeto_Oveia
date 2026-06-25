import React from "react";
import Link from "next/link";
import { LayoutDashboard, Dna, GlassWater, Award, ArrowRight, ShieldCheck, Check } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const cheeses = [
    { name: "Pecorino", origin: "Itália", milk: "Ovelha (100%)", texture: "Textura dura, compacta, sabor salgado e pronunciado.", pair: "Massas com molhos estruturados, vinhos tintos encorpados." },
    { name: "Feta", origin: "Grécia", milk: "Ovelha (mín. 70%) e Cabra", texture: "Massa coalhada curada em salmoura, textura quebradiça.", pair: "Saladas mediterrâneas, azeite extra virgem, torradas." },
    { name: "Boursin", origin: "França", milk: "Cabra ou Ovelha", texture: "Massa fresca, pastosa, cremosa e espalhável.", pair: "Pães artesanais, torradas, geleias de frutas vermelhas." },
    { name: "Neve", origin: "Brasil (Rima)", milk: "Ovelha", texture: "Massa mole de casca florida, textura extremamente cremosa.", pair: "Geleia de pimenta, espumantes secos." }
  ];

  return (
    <div className="flex-1 flex flex-col bg-la">
      {/* Navigation */}
      <header className="border-b border-areia bg-la/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-pasto rounded-xl flex items-center justify-center text-la font-serif font-bold text-lg">
              C
            </div>
            <span className="font-serif font-bold text-xl text-camurca tracking-tight">
              Capri<span className="text-pasto">&</span>Ovis
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <nav className="hidden md:flex space-x-8 items-center text-sm font-medium text-cabrito/70">
              <a href="#genetica" className="hover:text-pasto transition-colors">Genética</a>
              <a href="#leite" className="hover:text-pasto transition-colors">Qualidade Láctea</a>
              <a href="#derivados" className="hover:text-pasto transition-colors">Derivados Premium</a>
              <Link
                href="/dashboard"
                className="bg-pasto hover:bg-broto text-la hover:text-cabrito px-6 py-2.5 rounded-full font-semibold transition-all shadow-sm hover:shadow flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <LayoutDashboard className="w-4 h-4" />
                Acessar SGR
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Text */}
            <div className="z-10 text-center lg:text-left space-y-6 animate-fade-in-up">
              <span className="inline-block py-1 px-3.5 rounded-full bg-areia text-camurca text-xs font-bold uppercase tracking-widest border border-broto/30">
                Foco em Leite & Genética de Ponta
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-cabrito leading-tight">
                Melhoramento Genético e <span className="text-camurca">Qualidade Láctea</span>
              </h1>
              
              <p className="text-base sm:text-lg text-cabrito/85 max-w-2xl leading-relaxed">
                Desenvolvemos soluções científicas integradas para a ovinocaprinocultura leiteira. Maximizamos a produtividade e a robustez do rebanho utilizando a seleção genômica (PTAs, DEPs, chips SNP) aliada ao escore de manejo ideal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/dashboard"
                  className="bg-pasto hover:bg-broto hover:text-cabrito text-la px-8 py-4 rounded-full font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  Entrar no Portal do Produtor (SGR)
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#genetica"
                  className="bg-la border-2 border-areia text-camurca hover:bg-areia/40 px-8 py-4 rounded-full font-bold text-base transition-all flex items-center justify-center"
                >
                  Conhecer Pesquisa
                </a>
              </div>
            </div>

            {/* Right Column: Visual */}
            <div className="relative z-10 flex justify-center animate-fade-in-up">
              <div className="absolute inset-0 bg-milho/10 rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80"
                alt="Ovinocaprinocultura de alta genética"
                className="rounded-[2.5rem] shadow-xl w-full max-w-lg h-[400px] object-cover border-4 border-la"
              />
              
              {/* Floating badges */}
              <div className="absolute top-8 -left-6 bg-la p-3.5 rounded-2xl shadow-lg border border-areia flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-xl text-emerald-800">
                  <Dna className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-cabrito">Capragene®</p>
                  <p className="text-[10px] text-camurca">Zootecnia Oficial</p>
                </div>
              </div>

              <div className="absolute bottom-8 -right-6 bg-la p-3.5 rounded-2xl shadow-lg border border-areia flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-800">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-cabrito">Leite Premium</p>
                  <p className="text-[10px] text-camurca">Alto Rendimento</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Focus Area 1: Genetica */}
      <section id="genetica" className="py-20 bg-areia/30 border-t border-areia">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Image */}
            <div className="w-full lg:w-1/2 relative">
              <img
                src="https://images.unsplash.com/photo-1542841791-1925b02a2bf8?auto=format&fit=crop&w=800&q=80"
                alt="Seleção genética e controle de rebanhos"
                className="rounded-3xl shadow-md w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-broto/20 rounded-full -z-10"></div>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-pasto font-bold text-xs uppercase tracking-widest block">Biotecnologia e Melhoramento</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-camurca">
                Seleção Genômica Quantitativa
              </h2>
              <p className="text-cabrito/80 leading-relaxed">
                Utilizando modelos biométricos de parentesco e equações matemáticas complexas, calculamos a <strong>Capacidade Prevista de Transmissão (PTA)</strong> e a <strong>Diferença Esperada na Progênie (DEP)</strong>. Esse controle evita o declínio genético e a depressão por endogamia, assegurando a evolução biológica de raças de alta aptidão láctea, como a <em>Saanen</em>, <em>Alpina</em>, <em>Lacaune</em> e <em>East Friesian</em>.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-la border border-areia rounded-2xl flex gap-2">
                  <Check className="w-4 h-4 text-pasto flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-cabrito">Cálculo de F</h4>
                    <p className="text-[10px] text-cabrito/60">Controle rigoroso de consanguinidade na monta.</p>
                  </div>
                </div>
                <div className="p-4 bg-la border border-areia rounded-2xl flex gap-2">
                  <Check className="w-4 h-4 text-pasto flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-cabrito">Marcadores SNP</h4>
                    <p className="text-[10px] text-cabrito/60">DNA genômico para seleção precoce de reprodutores.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Focus Area 2: Leite */}
      <section id="leite" className="py-20 bg-la border-t border-areia">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            
            {/* Image */}
            <div className="w-full lg:w-1/2 relative">
              <img
                src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80"
                alt="Produção leiteira de ovinos e caprinos"
                className="rounded-3xl shadow-md w-full h-[400px] object-cover"
              />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-milho/10 rounded-full -z-10"></div>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-milho font-bold text-xs uppercase tracking-widest block">Caracterização Físico-Química</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-camurca">
                Qualidade Láctea Excepcional
              </h2>
              <p className="text-cabrito/80 leading-relaxed">
                O leite de pequenos ruminantes destaca-se por propriedades reológicas e nutricionais incomparáveis. O leite de <strong>cabra</strong> possui glóbulos de gordura menores e perfil lipídico de fácil digestão (hipoalergênico). O leite de <strong>ovelha</strong> apresenta teores de proteína e sólidos totais que chegam a dobrar o padrão bovino, gerando rendimento e gelificação ideais para queijaria fina.
              </p>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-areia/30 rounded-2xl">
                  <span className="block text-[10px] text-cabrito/50 font-bold uppercase mb-1">Cabra Sólidos</span>
                  <span className="font-serif font-bold text-base text-camurca">8.90%</span>
                </div>
                <div className="p-3 bg-areia/30 rounded-2xl">
                  <span className="block text-[10px] text-cabrito/50 font-bold uppercase mb-1">Ovelha Sólidos</span>
                  <span className="font-serif font-bold text-base text-camurca">12.00%</span>
                </div>
                <div className="p-3 bg-areia/30 rounded-2xl">
                  <span className="block text-[10px] text-cabrito/50 font-bold uppercase mb-1">Cálcio Ovelha</span>
                  <span className="font-serif font-bold text-xs text-camurca">~180% bovino</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Show Case: Queijos Finos / Derivados */}
      <section id="derivados" className="py-20 bg-areia/35 border-t border-areia">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-pasto font-bold text-xs uppercase tracking-widest block mb-2">Linha de Derivados</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-camurca">Queijos Finos com Lácteo de Qualidade</h2>
            <p className="text-cabrito/60 text-sm mt-2">A valorização gastronômica de cortes nobres e laticínios artesanais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cheeses.map((c, idx) => (
              <div key={idx} className="bg-la rounded-3xl border border-areia p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif font-bold text-lg text-cabrito">{c.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-areia rounded text-camurca">{c.origin}</span>
                  </div>
                  <span className="text-[10px] bg-pasto/10 text-pasto font-bold px-2 py-0.5 rounded-full inline-block mb-3">
                    Leite: {c.milk}
                  </span>
                  <p className="text-xs text-cabrito/70 leading-relaxed mb-4">{c.texture}</p>
                </div>
                <div className="border-t border-areia/50 pt-3 text-[10px] text-cabrito/50">
                  <strong>Harmonização:</strong> {c.pair}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SGR CTA Banner */}
      <section className="py-20 bg-pasto text-la text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            Gerencie o Rebanho com Rigor Científico
          </h2>
          <p className="text-la/80 max-w-2xl mx-auto text-base">
            Monitore acasalamentos direcionados, faça exames FAMACHA© integrados, projete rendimentos industriais e localize produtores parceiros. Tudo sob as diretrizes oficiais do programa zootécnico.
          </p>
          <div className="pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-la text-pasto hover:bg-broto hover:text-cabrito px-8 py-4 rounded-full font-bold text-base shadow-lg transition-all"
            >
              Acessar Painel de Controle (SGR)
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cabrito text-areia py-12 border-t-4 border-pasto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-areia/10 pb-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pasto rounded-xl flex items-center justify-center text-la font-serif font-bold">
                C
              </div>
              <span className="font-serif font-bold text-xl text-la">
                Capri<span className="text-pasto">&</span>Ovis
              </span>
            </div>
            <p className="text-xs text-areia/50 max-w-md text-center sm:text-right leading-relaxed">
              Trabalho acadêmico desenvolvido como proposta de interface institucional de ovinocaprinocultura leiteira e controle genético (SGR).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-areia/40">
            <p>&copy; 2026 Capri & Ovis. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <span>Embrapa Caprinos e Ovinos</span>
              <span>•</span>
              <span>Capragene® & Ovisleite</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
