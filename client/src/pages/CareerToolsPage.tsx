import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calculator,
  Percent,
  CheckCircle2,
  Mail,
  HelpCircle,
  Compass,
  FileText,
  Copy,
  Check,
  Sparkles,
  Wrench,
} from 'lucide-react';

export const CareerToolsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTool = searchParams.get('tool') || 'salary-calculator';

  const setTool = (toolName: string) => {
    setSearchParams({ tool: toolName });
  };

  // 1. Salary Calculator State
  const [ctc, setCtc] = useState<number>(12); // in LPA
  const calculateSalary = (lpa: number) => {
    const annualGross = lpa * 100000;
    const basicPay = annualGross * 0.5;
    const hra = annualGross * 0.25;
    const pfDeduction = Math.min(basicPay * 0.12, 21600);
    const estimatedTax = annualGross > 700000 ? (annualGross - 700000) * 0.15 : 0;
    const netAnnual = annualGross - pfDeduction - estimatedTax;
    const monthlyInHand = Math.round(netAnnual / 12);
    return {
      monthlyInHand,
      basicPay: Math.round(basicPay / 12),
      hra: Math.round(hra / 12),
      pfDeduction: Math.round(pfDeduction / 12),
      tax: Math.round(estimatedTax / 12),
    };
  };
  const salaryResults = calculateSalary(ctc);

  // 2. CGPA to Percentage State
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [scale, setScale] = useState<'10' | '4'>('10');
  const percentage =
    scale === '10'
      ? Math.min(100, Math.round(cgpa * 9.5 * 10) / 10)
      : Math.min(100, Math.round((cgpa / 4) * 100 * 10) / 10);

  // 3. ATS Checker State
  const [resumeText, setResumeText] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsTips, setAtsTips] = useState<string[]>([]);

  const analyzeResume = () => {
    if (!resumeText.trim()) return;
    const words = resumeText.toLowerCase().split(/\s+/);
    const keywords = [
      'react', 'node', 'typescript', 'javascript', 'python', 'java', 'sql', 'mongodb',
      'docker', 'aws', 'kubernetes', 'system design', 'rest api', 'graphql', 'git',
      'developed', 'architected', 'optimized', 'led', 'engineered', 'scaled', 'implemented'
    ];
    let matched = 0;
    keywords.forEach((k) => {
      if (resumeText.toLowerCase().includes(k)) matched++;
    });

    const calculated = Math.min(95, Math.max(40, Math.round((matched / 12) * 85) + 15));
    setAtsScore(calculated);

    const tips: string[] = [];
    if (words.length < 150) tips.push('Add more detail regarding technical impact, business metrics, and projects.');
    if (!resumeText.toLowerCase().includes('github') && !resumeText.toLowerCase().includes('linkedin')) {
      tips.push('Include visible links to your GitHub and LinkedIn profiles.');
    }
    if (matched < 6) {
      tips.push('Incorporate standard technical keywords relevant to your target role.');
    }
    tips.push('Use quantified impact metrics (e.g. "improved load times by 40%", "handled 10k requests/sec").');
    setAtsTips(tips);
  };

  // 4. Cover Letter Generator State
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [targetCompany, setTargetCompany] = useState('NexusFlow');
  const [keySkills, setKeySkills] = useState('React, TypeScript, Node.js, Cloud Services');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [letterCopied, setLetterCopied] = useState(false);

  const generateLetter = () => {
    const letter = `Dear Hiring Team at ${targetCompany},

I am writing to express my enthusiastic interest in the ${targetRole} opportunity. With demonstrated hands-on expertise in ${keySkills}, I have engineered and deployed high-performance software features that solve real user needs and scale reliably.

At my previous initiatives, I focused on writing clean, well-tested code, optimizing frontend experiences, and collaborating cross-functionally across squads. Having followed ${targetCompany}'s recent innovations, I am eager to contribute directly to your product roadmap.

Thank you for your time and consideration. I welcome the opportunity to discuss how my skill set aligns with your team's objectives.

Sincerely,
Candidate (via Skillora Career Hub)`;
    setGeneratedLetter(letter);
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(generatedLetter);
    setLetterCopied(true);
    setTimeout(() => setLetterCopied(false), 2000);
  };

  const toolsList = [
    { id: 'salary-calculator', name: 'Salary Calculator', icon: Calculator },
    { id: 'cgpa-calculator', name: 'CGPA Calculator', icon: Percent },
    { id: 'ats-checker', name: 'ATS Resume Checker', icon: CheckCircle2 },
    { id: 'cover-letter', name: 'Cover Letter Generator', icon: Mail },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-app">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-primary text-xs font-bold mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Interactive Utilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight mb-3">
            Career Tools & Accelerators
          </h1>
          <p className="text-sm text-text-muted font-medium">
            Calculate take-home salaries, convert academic scores, and optimize your application materials.
          </p>
        </div>

        {/* Tool Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {toolsList.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-surface border border-border-color text-text-muted hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* 1. In-Hand Salary Calculator */}
        {activeTool === 'salary-calculator' && (
          <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-border-color shadow-card-subtle max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-text-primary">
                In-Hand Take-Home Salary Calculator (India)
              </h2>
              <p className="text-xs text-text-muted mt-1 font-medium">
                Estimate monthly in-hand cash after Provident Fund (PF) and standard new tax regime deductions.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-text-primary">
                    Annual CTC Package:
                  </label>
                  <span className="text-base font-extrabold text-brand-primary">
                    ₹{ctc} LPA
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  step="0.5"
                  value={ctc}
                  onChange={(e) => setCtc(Number(e.target.value))}
                  className="w-full accent-brand-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-text-muted mt-1">
                  <span>₹2 LPA</span>
                  <span>₹30 LPA</span>
                  <span>₹60 LPA</span>
                </div>
              </div>

              {/* Result Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border-color">
                <div className="p-5 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40">
                  <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1">
                    Estimated Monthly In-Hand
                  </span>
                  <div className="text-3xl font-extrabold text-brand-primary">
                    ₹{salaryResults.monthlyInHand.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-text-muted mt-1 block">
                    (Approx. ₹{(salaryResults.monthlyInHand * 12).toLocaleString()} / year)
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-surface-2 border border-border-color space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted font-medium">Basic Pay / Mo:</span>
                    <span className="font-bold text-text-primary">₹{salaryResults.basicPay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted font-medium">HRA / Mo:</span>
                    <span className="font-bold text-text-primary">₹{salaryResults.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted font-medium">PF Deduction / Mo:</span>
                    <span className="font-bold text-text-primary">₹{salaryResults.pfDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted font-medium">Est. Income Tax / Mo:</span>
                    <span className="font-bold text-accent-warning">₹{salaryResults.tax.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CGPA to Percentage Calculator */}
        {activeTool === 'cgpa-calculator' && (
          <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-border-color shadow-card-subtle max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                CGPA to Percentage Converter
              </h2>
              <p className="text-xs text-text-muted mt-1 font-medium">
                Standard AICTE / Indian University formula (Percentage = CGPA × 9.5) and US 4.0 scale.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setScale('10');
                    setCgpa(8.5);
                  }}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    scale === '10' ? 'bg-brand-primary text-white shadow-sm' : 'bg-surface-2 text-text-muted'
                  }`}
                >
                  10.0 Scale (India / AICTE)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScale('4');
                    setCgpa(3.5);
                  }}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    scale === '4' ? 'bg-brand-primary text-white shadow-sm' : 'bg-surface-2 text-text-muted'
                  }`}
                >
                  4.0 Scale (US / International)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Enter your CGPA (Max {scale}):
                </label>
                <input
                  type="number"
                  min="0"
                  max={scale === '10' ? '10' : '4'}
                  step="0.05"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-2 border border-border-color text-xl font-bold text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="p-6 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40 rounded-2xl text-center">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1">
                  Equivalent Percentage
                </span>
                <div className="text-4xl font-extrabold text-brand-primary">
                  {percentage}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ATS Resume Checker */}
        {activeTool === 'ats-checker' && (
          <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-border-color shadow-card-subtle max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                ATS Resume Compatibility Score
              </h2>
              <p className="text-xs text-text-muted mt-1 font-medium">
                Paste your resume plain text below to evaluate keyword density, impact verbs, and ATS friendliness.
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here (e.g. Work Experience, Skills, Education, Projects)..."
                className="w-full p-4 rounded-2xl bg-surface-2 border border-border-color text-xs text-text-primary focus:outline-none focus:border-brand-primary font-mono resize-none"
              />

              <button
                onClick={analyzeResume}
                className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-2xl text-xs transition-colors shadow-sm"
              >
                Analyze Resume Text
              </button>

              {atsScore !== null && (
                <div className="mt-6 p-6 bg-surface-2 border border-border-color rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      Calculated ATS Score:
                    </span>
                    <span
                      className={`text-2xl font-extrabold ${
                        atsScore >= 75 ? 'text-accent-success' : 'text-accent-warning'
                      }`}
                    >
                      {atsScore}/100
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-text-primary">Feedback & Recommendations:</p>
                    <ul className="space-y-1.5 text-xs text-text-muted">
                      {atsTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Cover Letter Generator */}
        {activeTool === 'cover-letter' && (
          <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-border-color shadow-card-subtle max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                Tailored Cover Letter Generator
              </h2>
              <p className="text-xs text-text-muted mt-1 font-medium">
                Quickly draft a compelling cover letter tailored to your dream company and skill stack.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs text-text-primary font-medium focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Target Company</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. NexusFlow Technologies"
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs text-text-primary font-medium focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-text-primary mb-1">Key Strengths / Skills</label>
              <input
                type="text"
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                placeholder="e.g. React, Next.js, Distributed APIs"
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 border border-border-color text-xs text-text-primary font-medium focus:outline-none focus:border-brand-primary"
              />
            </div>

            <button
              onClick={generateLetter}
              className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-2xl text-xs transition-colors mb-6 shadow-sm flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Cover Letter</span>
            </button>

            {generatedLetter && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-primary">Generated Draft:</span>
                  <button
                    onClick={copyLetter}
                    className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
                  >
                    {letterCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{letterCopied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={10}
                  value={generatedLetter}
                  className="w-full p-4 rounded-2xl border border-border-color text-xs text-text-primary bg-surface-2 leading-relaxed font-sans resize-none"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
