import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Send } from 'lucide-react';
import { useData, LifeContext } from '@/contexts/DataContext';
import { toast } from 'sonner';

interface QuestionOption {
  emoji: string;
  label: string;
}

interface Question {
  key: keyof LifeContext;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

const questions: Question[] = [
  {
    key: 'workSchedule',
    title: 'When do you usually work?',
    subtitle: 'Work Schedule',
    options: [
      { emoji: '🌅', label: 'Morning Shift (6am–2pm)' },
      { emoji: '☀️', label: 'Day Shift (9am–5pm)' },
      { emoji: '🌙', label: 'Night Shift (10pm–6am)' },
      { emoji: '🔄', label: 'Rotating Shifts' },
      { emoji: '🏠', label: 'Work From Home' },
      { emoji: '❌', label: 'Not Working Currently' },
    ],
  },
  {
    key: 'commuteTime',
    title: 'How long is your daily commute?',
    subtitle: 'Daily Commute',
    options: [
      { emoji: '🚶', label: 'No commute / Work from home' },
      { emoji: '🕐', label: 'Less than 30 minutes' },
      { emoji: '🕑', label: '30 min – 1 hour' },
      { emoji: '🕒', label: '1–2 hours' },
      { emoji: '🕓', label: 'More than 2 hours' },
    ],
  },
  {
    key: 'foodAccess',
    title: 'How would you describe your access to healthy food?',
    subtitle: 'Food Access',
    options: [
      { emoji: '✅', label: 'Easy — markets/grocery stores nearby' },
      { emoji: '🏃', label: 'Moderate — need to travel a bit' },
      { emoji: '❌', label: 'Difficult — very limited options nearby' },
      { emoji: '🍱', label: 'I rely on tiffin/mess/canteen food' },
      { emoji: '⏰', label: 'I often skip meals due to time' },
    ],
  },
  {
    key: 'sleepHours',
    title: 'How many hours do you sleep on average?',
    subtitle: 'Sleep',
    options: [
      { emoji: '😴', label: 'Less than 4 hours' },
      { emoji: '🌙', label: '4–6 hours' },
      { emoji: '✅', label: '6–8 hours (healthy)' },
      { emoji: '😪', label: 'More than 9 hours' },
    ],
  },
  {
    key: 'stressLevel',
    title: 'How stressed do you feel on most days?',
    subtitle: 'Stress Level',
    options: [
      { emoji: '😊', label: 'Rarely stressed' },
      { emoji: '😐', label: 'Mildly stressed' },
      { emoji: '😟', label: 'Moderately stressed' },
      { emoji: '😰', label: 'Highly stressed' },
      { emoji: '🤯', label: 'Overwhelmed most of the time' },
    ],
  },
  {
    key: 'livingSituation',
    title: 'Who do you live with?',
    subtitle: 'Living Situation',
    options: [
      { emoji: '👤', label: 'Alone' },
      { emoji: '👨‍👩‍👧', label: 'With family' },
      { emoji: '🏠', label: 'With roommates' },
      { emoji: '🏥', label: 'Assisted care / hostel' },
    ],
  },
];

export default function PatientIntake() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Partial<LifeContext>>({});
  const [showSummary, setShowSummary] = useState(false);
  const { addPatient } = useData();
  const navigate = useNavigate();

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const select = (value: string) => {
    const newAnswers = { ...answers, [q.key]: value };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowSummary(true);
      }
    }, 400);
  };

  const handleSubmit = () => {
    addPatient(answers as LifeContext);
    toast.success('Life context submitted successfully!');
    navigate('/patient/dashboard');
  };

  if (showSummary) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <div className="mb-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10"
              >
                <Check className="h-8 w-8 text-secondary" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground">Your Life Context is Ready</h2>
              <p className="mt-2 text-muted-foreground">
                Your doctor will now see a fuller picture of your life to give you care that actually fits.
              </p>
            </div>

            <div className="mb-6 space-y-3">
              {questions.map((question) => (
                <div key={question.key} className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm font-medium text-muted-foreground">{question.subtitle}:</span>
                  <span className="text-sm font-semibold text-foreground">
                    {answers[question.key]}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-hero px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-elevated transition-opacity hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              Submit to My Doctor
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8">
      {/* Progress */}
      <div className="mb-8 w-full max-w-lg">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full gradient-hero"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-2 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{q.subtitle}</span>
            </div>
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">{q.title}</h2>

            <div className="space-y-3">
              {q.options.map((opt) => {
                const isSelected = answers[q.key] === opt.label;
                return (
                  <motion.button
                    key={opt.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => select(opt.label)}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-card'
                        : 'border-border bg-card hover:border-primary/30 hover:shadow-card'
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                      {opt.emoji}
                    </span>
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto flex h-6 w-6 items-center justify-center rounded-full gradient-hero"
                      >
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          {answers[q.key] && currentQ < questions.length - 1 && (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      {currentQ === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            This helps your doctor give advice that actually works for you.
          </p>
        </motion.div>
      )}
    </div>
  );
}
