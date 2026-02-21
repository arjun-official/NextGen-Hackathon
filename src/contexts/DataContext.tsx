import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LifeContext {
  workSchedule: string;
  commuteTime: string;
  foodAccess: string;
  sleepHours: string;
  stressLevel: string;
  livingSituation: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  condition: string;
  age: string;
  medications: string;
  standardCare: string;
  lifeContext: LifeContext;
  adaptedCarePlan: string;
  conflictFlags: string[];
  status: 'pending' | 'reviewed';
  createdAt: string;
}

interface DataContextType {
  patients: Patient[];
  addPatient: (lifeContext: LifeContext) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  getPatient: (id: string) => Patient | undefined;
  currentPatientLifeContext: LifeContext | null;
  setCurrentPatientLifeContext: (lc: LifeContext | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function generateFlags(lifeContext: LifeContext, condition: string): string[] {
  const flags: string[] = [];
  if (lifeContext.workSchedule === 'Night Shift (10pm–6am)') {
    flags.push('⚠️ Patient works night shifts — morning medication schedule may fail');
  }
  if (lifeContext.workSchedule === 'Rotating Shifts') {
    flags.push('⚠️ Rotating shifts — consistent medication timing will be challenging');
  }
  if (lifeContext.stressLevel === 'Highly stressed' || lifeContext.stressLevel === 'Overwhelmed most of the time') {
    flags.push('⚠️ High stress reported — consider mental health referral');
  }
  if (lifeContext.foodAccess === 'Difficult — very limited options nearby' || lifeContext.foodAccess === 'I often skip meals due to time') {
    flags.push('⚠️ Limited food access — standard diet plan may be unrealistic');
  }
  if (lifeContext.sleepHours === 'Less than 4 hours') {
    flags.push('⚠️ Severe sleep deprivation — recovery will be significantly impacted');
  }
  if (lifeContext.commuteTime === '1–2 hours' || lifeContext.commuteTime === 'More than 2 hours') {
    flags.push('⚠️ Long commute — exercise and meal prep time is limited');
  }
  if (lifeContext.livingSituation === 'Alone') {
    flags.push('⚠️ Lives alone — may need additional support for medication compliance');
  }
  return flags;
}

const initialPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    condition: 'Type 2 Diabetes',
    age: '34',
    medications: 'Metformin 500mg twice daily',
    standardCare: 'Regular exercise, balanced diet, monitor blood sugar',
    lifeContext: {
      workSchedule: 'Night Shift (10pm–6am)',
      commuteTime: '1–2 hours',
      foodAccess: 'I rely on tiffin/mess/canteen food',
      sleepHours: '4–6 hours',
      stressLevel: 'Highly stressed',
      livingSituation: 'Alone',
    },
    adaptedCarePlan: '',
    conflictFlags: [],
    status: 'pending',
    createdAt: '2026-02-18',
  },
  {
    id: 'p2',
    name: 'Sanya Kapoor',
    email: 'sanya@example.com',
    condition: 'Hypertension',
    age: '45',
    medications: 'Amlodipine 5mg daily',
    standardCare: 'Low sodium diet, regular BP monitoring, stress management',
    lifeContext: {
      workSchedule: 'Day Shift (9am–5pm)',
      commuteTime: '30 min – 1 hour',
      foodAccess: 'Easy — markets/grocery stores nearby',
      sleepHours: '6–8 hours (healthy)',
      stressLevel: 'Moderately stressed',
      livingSituation: 'With family',
    },
    adaptedCarePlan: '',
    conflictFlags: [],
    status: 'pending',
    createdAt: '2026-02-19',
  },
  {
    id: 'p3',
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    condition: 'Chronic Back Pain',
    age: '28',
    medications: 'Ibuprofen as needed, Muscle relaxant',
    standardCare: 'Physical therapy, posture correction, weight management',
    lifeContext: {
      workSchedule: 'Rotating Shifts',
      commuteTime: 'More than 2 hours',
      foodAccess: 'I often skip meals due to time',
      sleepHours: 'Less than 4 hours',
      stressLevel: 'Overwhelmed most of the time',
      livingSituation: 'With roommates',
    },
    adaptedCarePlan: '',
    conflictFlags: [],
    status: 'pending',
    createdAt: '2026-02-20',
  },
];

// Pre-generate flags
initialPatients.forEach(p => {
  p.conflictFlags = generateFlags(p.lifeContext, p.condition);
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [currentPatientLifeContext, setCurrentPatientLifeContext] = useState<LifeContext | null>(null);

  const addPatient = (lifeContext: LifeContext) => {
    const existing = patients.find(p => p.id === 'p1');
    if (existing) {
      updatePatient('p1', { lifeContext, conflictFlags: generateFlags(lifeContext, existing.condition) });
    }
    setCurrentPatientLifeContext(lifeContext);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const getPatient = (id: string) => patients.find(p => p.id === id);

  return (
    <DataContext.Provider value={{ patients, addPatient, updatePatient, getPatient, currentPatientLifeContext, setCurrentPatientLifeContext }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
