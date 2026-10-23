import React from 'react';
import { Droplet, Heart, PhoneCall, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenDisclaimer: () => void;
  onOpenDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenDisclaimer,
  onOpenDocs,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                <Droplet className="w-4 h-4 fill-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">RareLife</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Intelligent Rare Blood Donor Discovery & Emergency Matching System. Designed to
              accelerate emergency matching for Bombay phenotype (Oh/hh), Rh-null, and ultra-rare
              blood groups.
            </p>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Laboratory Immunohematology Standards</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Emergency Discovery
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('search')}
                  className="hover:text-white transition-colors"
                >
                  Emergency Donor Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className="hover:text-white transition-colors"
                >
                  Active Case Tracking & Escalation
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('donor-register')}
                  className="hover:text-white transition-colors"
                >
                  Register Rare Blood Phenotype
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('bb-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Blood Bank & Depot Coordination
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Transfusion Sciences
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('awareness')}
                  className="hover:text-white transition-colors"
                >
                  Bombay (Oh/hh) Phenotype Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('awareness')}
                  className="hover:text-white transition-colors"
                >
                  Rh-null & Rare Alloimmunization
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDisclaimer}
                  className="hover:text-white transition-colors text-amber-400"
                >
                  Clinical Crossmatch Protocols
                </button>
              </li>
              <li>
                <button onClick={onOpenDocs} className="hover:text-white transition-colors">
                  Backend Architecture & MySQL Spec
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Emergency Coordination
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>24/7 Rare Donor Escalation</span>
              </div>
              <p className="text-[11px] text-slate-300">
                In urgent situations, coordinate directly with hospital immunohematology departments
                or authorized central blood depots.
              </p>
              <div className="text-[11px] text-slate-400">
                KEM Depot: <span className="font-mono text-slate-200">+91 22 2410 7000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; 2026 RareLife System. College Engineering Prototype — Information Technology.
          </div>
          <div className="flex items-center gap-4">
            <span>ISO/IEC Transfusion Registry Compliant Data Architecture</span>
            <span aria-hidden="true">&middot;</span>
            <button onClick={onOpenDisclaimer} className="hover:text-white underline">
              Medical Safety Notice
            </button>
            <span aria-hidden="true">&middot;</span>
            <button onClick={onOpenDocs} className="hover:text-white underline">
              Java Spring Boot + MySQL
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
