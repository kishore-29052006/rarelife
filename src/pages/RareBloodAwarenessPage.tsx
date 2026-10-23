import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Compass,
  Droplet,
  ExternalLink,
  Heart,
  HelpCircle,
  Microscope,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

interface RareBloodAwarenessPageProps {
  onNavigate: (tab: string, context?: any) => void;
}

export const RareBloodAwarenessPage: React.FC<RareBloodAwarenessPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-100">
          Transfusion Medicine & Immunohematology
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Understanding Rare Blood Groups & Phenotypes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Why standard ABO/Rh compatibility is not enough, and how specialized donor matching saves
          lives in critical transfusion emergencies.
        </p>
      </div>

      {/* Critical Medical Warning Box */}
      <div className="p-6 bg-rose-50 border-2 border-rose-200 rounded-3xl space-y-3 text-xs text-rose-950 leading-relaxed shadow-sm">
        <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>The Bombay Phenotype Paradox: Why Universal O-Negative Blood Is Fatal</span>
        </div>
        <p>
          In common medical parlance, O-negative blood is often referred to as the &ldquo;universal
          donor.&rdquo; For 99.9% of the world population, O-negative red cells lack A, B, and Rh(D)
          antigens, making them safely acceptable in trauma situations.
        </p>
        <p className="bg-white/80 p-3 rounded-xl border border-rose-200 text-rose-900 font-medium">
          However, for an individual with the rare <strong>Bombay phenotype (Oh/hh)</strong>,
          transfusing standard O-negative blood will cause severe, immediate, and potentially fatal
          intravascular hemolysis.
        </p>
        <p>
          This occurs because O-negative red cells are heavily coated with the <strong>H antigen</strong>.
          Because Bombay phenotype patients cannot synthesize H antigen, their immune system treats
          H substance as a foreign invader and maintains potent, high-titer IgM/IgG anti-H antibodies
          at 37&deg;C body temperature.
        </p>
      </div>

      {/* Deep-Dive Articles */}
      <div className="space-y-8">
        {/* Topic 1: The Bombay Blood Group */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-wider text-[11px]">
            <Droplet className="w-4 h-4 fill-rose-600" />
            <span>Genetics & Immunohematology</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            What is the Bombay Blood Group (Oh/hh Phenotype)?
          </h2>
          <div className="space-y-3 text-slate-600 leading-relaxed text-xs">
            <p>
              First documented in 1952 by Dr. Y. M. Bhende and colleagues in Bombay (now Mumbai),
              India, the Bombay phenotype is an autosomal recessive trait caused by homozygous
              mutations in the <em>FUT1</em> gene on chromosome 19.
            </p>
            <p>
              The <em>FUT1</em> gene encodes alpha-(1,2)-fucosyltransferase, the enzyme responsible
              for adding L-fucose to precursor carbohydrate chains to form the <strong>H antigen</strong>.
              The H antigen is the essential foundation upon which A and B sugars are subsequently
              attached.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Normal Red Blood Cells</span>
                <p className="text-[11px] text-slate-500">
                  Express abundant H antigen. In group O individuals, the H antigen remains
                  unmodified. In group A/B, enzymes convert H into A/B antigens.
                </p>
              </div>
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-1">
                <span className="font-bold text-rose-950 block">Bombay (Oh/hh) Red Blood Cells</span>
                <p className="text-[11px] text-rose-800">
                  Completely devoid of H antigen. They type as group &ldquo;O&rdquo; on forward
                  grouping, but their serum aggressively lyses all ABO cells (including O) due to
                  potent anti-H antibodies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Topic 2: Rh-Null and other rare blood phenotypes */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 text-amber-600 font-bold uppercase tracking-wider text-[11px]">
            <Microscope className="w-4 h-4" />
            <span>Alloimmunization & Specialized Antigens</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Rh-null (&ldquo;Golden Blood&rdquo;) and Alloantibody Complexities
          </h2>
          <div className="space-y-3 text-slate-600 leading-relaxed text-xs">
            <p>
              Beyond the ABO and H systems, human red cells express more than 350 recognized blood
              group antigens classified by the International Society of Blood Transfusion (ISBT).
            </p>
            <ul className="space-y-2 list-disc pl-5 text-slate-700">
              <li>
                <strong>Rh-null Phenotype:</strong> Red cells that lack all 61 antigens in the Rh
                blood group system. Because it is universally accepted across complex Rh
                alloimmunizations, it is termed &ldquo;Golden Blood,&rdquo; but fewer than 50
                individuals globally have been identified.
              </li>
              <li>
                <strong>Kell System (Anti-K Alloimmunization):</strong> Anti-Kell antibodies are a
                leading cause of severe hemolytic disease of the fetus and newborn (HDFN) and acute
                transfusion reactions. Patients with anti-K require strictly K-negative units.
              </li>
              <li>
                <strong>Duffy Null (Fy(a-b-)):</strong> Lacks Duffy glycoprotein (which also acts as
                the receptor for <em>Plasmodium vivax</em> malaria). Alloimmunized individuals
                require specialized crossmatched units.
              </li>
            </ul>
          </div>
        </div>

        {/* Topic 3: How Blood Banks & Coordinators Mobilize */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Transfusion Coordination Protocols</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            How Rare-Donor Registries & Cryogenic Depots Function
          </h2>
          <div className="space-y-3 text-slate-600 leading-relaxed text-xs">
            <p>
              When a patient requiring rare blood is admitted for elective surgery or trauma:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">1. Autologous Pre-Deposit</span>
                <p className="text-[11px] text-slate-500">
                  Where feasible, stable patients with rare phenotypes donate their own blood prior
                  to scheduled surgeries.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">2. Cryopreservation</span>
                <p className="text-[11px] text-slate-500">
                  Rare units are treated with glycerol and frozen at -80&deg;C to -196&deg;C,
                  enabling preservation for up to 10–30 years in specialized rare depots.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">3. Rapid Geolocation Alerts</span>
                <p className="text-[11px] text-slate-500">
                  Platforms like RareLife connect hospitals directly with living, verified rare
                  donors within driving distance to arrange fresh donations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credible Medical References Strip */}
      <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider">
          Scientific Literature & Regulatory References
        </h3>
        <ul className="space-y-2 text-[11px] text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-rose-400 font-bold">&bull;</span>
            <span>
              Bhende YM, Deshpande CK, Bhatia HM, et al. <em>A &ldquo;new&rdquo; blood-group character related to the ABO system.</em> Lancet. 1952;1(6714):903-904.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-400 font-bold">&bull;</span>
            <span>
              International Society of Blood Transfusion (ISBT) Working Party on Red Cell Immunogenetics and Blood Group Terminology. <em>Red Cell Antigen Guidelines (2024–2026).</em>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-400 font-bold">&bull;</span>
            <span>
              World Health Organization (WHO). <em>Guidelines for the Screening of Donated Blood for Transfusion-Transmissible Infections and Immunohematology Best Practices.</em>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-400 font-bold">&bull;</span>
            <span>
              National Institute of Immunohematology (NIIH / ICMR). <em>Rare Blood Group Registry in India: Identification, Registry, and Transfusion Management Protocols.</em>
            </span>
          </li>
        </ul>
      </div>

      {/* Call to action */}
      <div className="p-8 bg-gradient-to-r from-rose-50 to-white rounded-3xl border border-rose-200 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Do You Have a Rare Blood Phenotype?
        </h3>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          Your voluntary registration can be the difference between life and death for a surgical or
          trauma patient in need of an exact immunohematology match.
        </p>
        <button
          onClick={() => onNavigate('donor-register')}
          className="px-6 py-3 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm shadow-rose-200"
        >
          Enroll Your Profile in RareLife Registry &rarr;
        </button>
      </div>
    </div>
  );
};
