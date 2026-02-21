import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import { Download, RefreshCw, Briefcase, Bus, Apple, Moon, Brain, Home } from 'lucide-react';
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

export default function PatientDashboard() {
  const { user } = useAuth();
  const { getPatient } = useData();
  const patient = getPatient('p1');

  if (!patient) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No data yet.</p>
          <Link to="/patient/intake" className="mt-4 inline-flex rounded-xl gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground">
            Complete Intake Form
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (!patient.adaptedCarePlan) {
      toast.error('No care plan available yet. Your doctor will generate one soon.');
      return;
    }
    exportCarePlanPDF(patient);
    toast.success('PDF downloaded!');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Hello {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mb-8 text-muted-foreground">Here's your health context profile</p>
        </motion.div>

        {/* Life Context Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <h2 className="mb-4 text-lg font-bold text-foreground">🌍 Your Life Context</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(patient.lifeContext).map(([key, value]) => {
              const Icon = contextIcons[key];
              return (
                <div key={key} className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{contextLabels[key]}</p>
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Conflict Flags */}
        {patient.conflictFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 rounded-2xl border border-accent/30 bg-accent/5 p-6"
          >
            <h2 className="mb-3 text-lg font-bold text-foreground">⚠️ Conflict Flags</h2>
            <div className="space-y-2">
              {patient.conflictFlags.map((flag, i) => (
                <p key={i} className="text-sm text-foreground">{flag}</p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Adapted Care Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <h2 className="mb-3 text-lg font-bold text-foreground">📋 Your Adapted Care Plan</h2>
          {patient.adaptedCarePlan ? (
            <div className="whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-sm text-foreground">
              {patient.adaptedCarePlan}
            </div>
          ) : (
            <div className="rounded-xl bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">Your doctor hasn't generated a personalized care plan yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">Check back soon!</p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl gradient-hero px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            Download Care Plan (PDF)
          </button>
          <Link
            to="/patient/intake"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-card transition-colors hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Update My Life Context
          </Link>
        </div>
      </div>
    </div>
  );
}
