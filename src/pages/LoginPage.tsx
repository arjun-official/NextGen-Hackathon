import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';

interface LoginPageProps {
  role: 'patient' | 'doctor';
}

export default function LoginPage({ role }: LoginPageProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(role);
    navigate(role === 'patient' ? '/patient/intake' : '/doctor/dashboard');
  };

  const isPatient = role === 'patient';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
          <div className="mb-6 text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isPatient ? 'gradient-hero' : 'bg-secondary'}`}>
              <span className="text-3xl">{isPatient ? '🩺' : '👨‍⚕️'}</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isPatient ? 'Patient' : 'Doctor'} Login
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isPatient
                ? 'Share your life context for better healthcare'
                : 'Access your patients\' real-life context'}
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-3.5 text-base font-semibold text-foreground shadow-card transition-all hover:bg-muted hover:shadow-elevated"
          >
            <Chrome className="h-5 w-5" />
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo mode — click to sign in as a mock {role}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
