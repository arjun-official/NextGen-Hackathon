import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { AlertTriangle, ChevronRight } from 'lucide-react';

export default function FlaggedCases() {
  const { patients } = useData();
  const flagged = patients.filter(p => p.conflictFlags.length >= 3);

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">🔴 Flagged Cases</h1>
          <p className="mb-8 text-muted-foreground">
            Patients with high-conflict flags that need urgent plan adaptation
          </p>
        </motion.div>

        {flagged.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-card">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-lg font-medium text-foreground">No flagged cases</p>
            <p className="mt-1 text-sm text-muted-foreground">All patients have manageable risk levels</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flagged.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/doctor/patient/${patient.id}`}
                  className="block rounded-2xl border border-danger/20 bg-danger/5 p-6 transition-all hover:shadow-elevated"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
                        <AlertTriangle className="h-5 w-5 text-danger" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">{patient.condition}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="space-y-1.5">
                    {patient.conflictFlags.map((flag, j) => (
                      <p key={j} className="text-sm text-foreground">{flag}</p>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
