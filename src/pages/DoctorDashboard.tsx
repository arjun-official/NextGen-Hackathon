import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Search, AlertTriangle, CheckCircle, Clock, ChevronRight, Users, Flag } from 'lucide-react';

function getSeverity(flags: string[]): 'high' | 'moderate' | 'low' {
  if (flags.length >= 3) return 'high';
  if (flags.length >= 1) return 'moderate';
  return 'low';
}

const severityConfig = {
  high: { label: 'High Risk', color: 'bg-danger/10 text-danger border-danger/20', dot: 'bg-danger' },
  moderate: { label: 'Moderate', color: 'bg-accent/10 text-accent border-accent/20', dot: 'bg-accent' },
  low: { label: 'Low', color: 'bg-secondary/10 text-secondary border-secondary/20', dot: 'bg-secondary' },
};

export default function DoctorDashboard() {
  const { patients } = useData();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'flagged'>('all');

  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'flagged') return matchesSearch && getSeverity(p.conflictFlags) === 'high';
    return matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Manage your patients and their life context</p>
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Patients', value: patients.length, icon: Users, iconColor: 'text-primary' },
            { label: 'Pending Review', value: patients.filter(p => p.status === 'pending').length, icon: Clock, iconColor: 'text-accent' },
            { label: 'Flagged Cases', value: patients.filter(p => getSeverity(p.conflictFlags) === 'high').length, icon: Flag, iconColor: 'text-danger' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs + search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {(['all', 'flagged'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'gradient-hero text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'all' ? 'All Patients' : '🔴 Flagged Cases'}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
            />
          </div>
        </div>

        {/* Patient list */}
        <div className="space-y-3">
          {filtered.map((patient, i) => {
            const severity = getSeverity(patient.conflictFlags);
            const config = severityConfig[severity];
            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/doctor/patient/${patient.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <span className="text-lg font-bold text-primary">{patient.name[0]}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-foreground">{patient.name}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${config.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {patient.condition || 'No condition set'} • {patient.lifeContext.workSchedule}
                    </p>
                  </div>

                  <div className="hidden items-center gap-3 sm:flex">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      patient.status === 'reviewed' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                    }`}>
                      {patient.status === 'reviewed' ? (
                        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Reviewed</span>
                      ) : (
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>
                      )}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No patients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
