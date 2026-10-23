import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, X } from 'lucide-react';

interface MedicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalDisclaimerModal: React.FC<MedicalDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Transfusion Safety & Clinical Notice
              </h3>
              <p className="text-xs text-slate-500">
                Medical Disclaimer & Regulatory Protocol Compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-sm text-slate-600">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="font-semibold block mb-1">
                Never Transfuse Based On System Match Labels Alone
              </strong>
              RareLife provides preliminary donor discovery and prioritization assistance. It is NOT
              a substitute for a licensed hospital transfusion medicine service or certified blood
              bank. ABO/Rh grouping and automated phenotype sorting do not constitute medical
              compatibility.
            </div>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-slate-700">
            <h4 className="font-semibold text-slate-900 text-sm">Key Clinical Protocols:</h4>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Crossmatch Verification:</strong> A full serological major/minor
                crossmatch and antibody screening must always be performed in an accredited
                laboratory prior to any transfusion.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bombay Phenotype Rule:</strong> Bombay (Oh/hh) patients carry high-titer
                anti-H antibodies. Ordinary O-negative blood will cause acute, potentially fatal
                hemolysis. Only verified Oh/hh units may be transfused.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Donor Eligibility:</strong> Final donor medical suitability (hemoglobin,
                vital signs, infectious disease markers TTI testing, and 90-day interval) must be
                re-screened on-site by authorized personnel.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy & Security:</strong> Protected health information (PHI) and raw
                donor contact numbers are strictly safeguarded and never published publicly.
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
};
