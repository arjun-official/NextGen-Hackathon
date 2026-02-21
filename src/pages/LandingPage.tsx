import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Apple, Home, Bus, Heart, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-illustration.png';

const floatingIcons = [
  { Icon: Clock, delay: 0, x: -60, y: -40 },
  { Icon: Apple, delay: 0.2, x: 60, y: -50 },
  { Icon: Home, delay: 0.4, x: -80, y: 30 },
  { Icon: Bus, delay: 0.6, x: 70, y: 40 },
  { Icon: Heart, delay: 0.8, x: 0, y: -70 },
];

const cards = [
  {
    emoji: '🏥',
    title: 'Doctors prescribe rest.',
    subtitle: 'You work night shifts.',
    color: 'bg-primary/10 border-primary/20',
  },
  {
    emoji: '🥗',
    title: 'They say eat healthy.',
    subtitle: "Your area has no grocery store.",
    color: 'bg-secondary/10 border-secondary/20',
  },
  {
    emoji: '🌉',
    title: 'CareContext bridges this gap.',
    subtitle: 'Healthcare that fits your real life.',
    color: 'bg-accent/10 border-accent/20',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-12 md:pt-20">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

        <div className="container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <Heart className="h-4 w-4" />
              Healthcare reimagined
            </motion.div>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Care<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Context</span>
            </h1>

            <p className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl">
              Healthcare that fits your real life, not just a prescription pad.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/patient/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl gradient-hero px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-elevated transition-all hover:opacity-90 hover:shadow-glow"
              >
                I'm a Patient
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/doctor/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-card px-6 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                I'm a Doctor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative flex-1"
          >
            <div className="relative mx-auto max-w-lg">
              <img
                src={heroImage}
                alt="Doctor and patient with lifestyle context"
                className="w-full rounded-2xl"
              />
              {/* Floating icons */}
              {floatingIcons.map(({ Icon, delay, x, y }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + delay, type: 'spring' }}
                  className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card"
                  style={{
                    top: `calc(50% + ${y}px)`,
                    left: `calc(50% + ${x}px)`,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2 + delay, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem cards */}
      <section className="px-4 pb-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold text-foreground">The Problem We Solve</h2>
            <p className="text-muted-foreground">Medical advice ignores real-world constraints. We fix that.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`rounded-2xl border p-8 ${card.color} transition-all hover:shadow-elevated`}
              >
                <span className="mb-4 block text-4xl">{card.emoji}</span>
                <h3 className="mb-2 text-lg font-bold text-foreground">{card.title}</h3>
                <p className="text-muted-foreground">{card.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 CareContext. Healthcare that fits your real life.
        </div>
      </footer>
    </div>
  );
}
