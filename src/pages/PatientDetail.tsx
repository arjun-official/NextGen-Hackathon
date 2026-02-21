import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Sparkles, Download, Send, Briefcase, Bus, Apple, Moon, Brain, Home, Loader2 } from 'lucide-react';
import { exportCarePlanPDF } from '@/utils/pdfExport';
import { toast } from 'sonner';

const contextIcons: Record<string, any> = {
  workSchedule: Briefcase,
  commuteTime: Bus,
  foodAccess: Apple,
  sleepHours: Moon,
  stressLevel: Brain,
  livingSituation: Home,
};

const contextLabels: Record<string, string> = {
  workSchedule: 'Work Schedule',
  commuteTime: 'Daily Commute',
  foodAccess: 'Food Access',
  sleepHours: 'Sleep',
  stressLevel: 'Stress Level',
  livingSituation: 'Living Situation',
};

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { getPatient, updatePatient } = useData();
  const patient = getPatient(id || '');

  const [condition, setCondition] = useState(patient?.condition || '');
  const [medications, setMedications] = useState(patient?.medications || '');
  const [standardCare, setStandardCare] = useState(patient?.standardCare || '');
  const [carePlan, setCarePlan] = useState(patient?.adaptedCarePlan || '');
  const [generating, setGenerating] = useState(false);

  if (!patient) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Patient not found</p>
      </div>
    );
  }

  const generateCarePlan = async () => {
    setGenerating(true);

    // Simulate AI generation with a realistic delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    const lc = patient.lifeContext;
    const plan = `🕐 MORNING ROUTINE
• Since you work ${lc.workSchedule.toLowerCase()}, adjust your wake-up routine accordingly
• Take medications ${lc.workSchedule.includes('Night') ? 'before your shift starts at 9:30 PM' : 'with breakfast at 8:00 AM'}
• 5-minute stretching routine before leaving

💊 MEDICATION SCHEDULE
• ${medications || 'As prescribed'} — ${lc.workSchedule.includes('Night') ? 'shifted to evening timing to match your schedule' : 'morning and evening with meals'}
• Set phone alarms as reminders
• Keep a weekly pill organizer

🥗 DIET ADJUSTMENTS
• ${lc.foodAccess.includes('Difficult') || lc.foodAccess.includes('tiffin') ? 'Since healthy food access is limited, focus on: requesting healthier options from your canteen, keeping fruits and nuts as snacks, drinking adequate water' : 'Maintain balanced meals with vegetables, lean protein, and whole grains'}
• ${lc.foodAccess.includes('skip meals') ? 'CRITICAL: Meal skipping worsens your condition. Prep simple meals on days off' : 'Eat at regular intervals, avoid processed food'}

🏃 EXERCISE
• ${lc.commuteTime.includes('2 hours') || lc.commuteTime.includes('1–2') ? 'Long commute limits exercise time — walk during breaks, use stairs, do desk stretches' : '30 minutes of moderate activity daily — walking, cycling, or yoga'}
• ${lc.stressLevel.includes('stressed') || lc.stressLevel.includes('Overwhelmed') ? 'Gentle yoga or breathing exercises can help manage stress' : 'Maintain current activity level'}

🧠 MENTAL HEALTH
• ${lc.stressLevel.includes('Highly') || lc.stressLevel.includes('Overwhelmed') ? 'PRIORITY: Consider speaking with a counselor. Your stress level significantly impacts recovery.' : 'Continue stress management practices'}
• ${lc.livingSituation === 'Alone' ? 'Living alone can be isolating — join a support group or maintain social connections' : 'Lean on your support system for encouragement'}
• Practice 5-minute breathing exercises daily

📅 FOLLOW-UP
• Schedule check-in in 2 weeks
• Track symptoms in a daily journal
• Contact your doctor if symptoms worsen`;

    setCarePlan(plan);
    setGenerating(false);
    toast.success('Care plan generated!');
  };

  const handleSave = () => {
    updatePatient(patient.id, {
      condition,
      medications,
      standardCare,
      adaptedCarePlan: carePlan,
      status: 'reviewed',
    });
    toast.success('Care plan saved and sent to patient!');
  };

  const handleDownload = () => {
    if (!carePlan) {
      toast.error('Generate a care plan first');
      return;
    }
    exportCarePlanPDF({ ...patient, condition, medications, adaptedCarePlan: carePlan });
    toast.success('PDF downloaded!');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/doctor/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="mb-2 text-3xl font-bold text-foreground">{patient.name}</h1>
          <p className="mb-8 text-muted-foreground">Patient ID: {patient.id} • Submitted: {patient.createdAt}</p>
        </motion.div>

        {/* Two columns */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Clinical data */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <h2 className="mb-4 text-lg font-bold text-foreground">📋 Clinical Data</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Age</label>
                <input
                  type="text"
                  value={patient.age}
                  readOnly
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Condition / Diagnosis</label>
                <input
                  type="text"
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Current Medications</label>
                <textarea
                  value={medications}
                  onChange={e => setMedications(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Standard Care Advice</label>
                <textarea
                  value={standardCare}
                  onChange={e => setStandardCare(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </motion.div>

          {/* Life context card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-accent/30 bg-accent/5 p-6"
          >
            <h2 className="mb-4 text-lg font-bold text-foreground">🌍 Real Life Context</h2>
            <div className="space-y-3">
              {Object.entries(patient.lifeContext).map(([key, value]) => {
                const Icon = contextIcons[key];
                return (
                  <div key={key} className="flex items-center gap-3 rounded-xl bg-card/60 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{contextLabels[key]}</p>
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Conflict flags */}
        {patient.conflictFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 rounded-2xl border border-accent/30 bg-accent/5 p-6"
          >
            <h2 className="mb-3 text-lg font-bold text-foreground">⚠️ AI-Generated Conflict Flags</h2>
            <div className="space-y-2">
              {patient.conflictFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-0.5 shrink-0">⚠️</span>
                  <span>{flag.replace('⚠️ ', '')}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Generate care plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground">✨ Adapted Care Plan</h2>
            <button
              onClick={generateCarePlan}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-xl gradient-hero px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {generating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Generate Adapted Care Plan (AI)</>
              )}
            </button>
          </div>

          {generating && (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          )}

          {carePlan && !generating && (
            <div className="mb-4 whitespace-pre-wrap rounded-xl bg-muted/30 p-5 text-sm leading-relaxed text-foreground">
              {carePlan}
            </div>
          )}

          {carePlan && !generating && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-opacity hover:opacity-90"
              >
                <Send className="h-4 w-4" />
                Save & Send to Patient
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Download className="h-4 w-4" />
                Download as PDF
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
