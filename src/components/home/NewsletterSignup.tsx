import React, { useState } from 'react';
import { Loader2, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

type SignupState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

const STORAGE_KEY = 'fablinks_newsletter_subscribed';

/**
 * Newsletter signup band — writes to `newsletter_subscribers`, which the
 * admin Newsletter page already manages (RLS: anyone can subscribe).
 */
const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SignupState>('idle');

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setState('error');
      return;
    }

    // The anon role cannot read the table (RLS), so dedupe per-browser here.
    if (localStorage.getItem(STORAGE_KEY) === trimmed.toLowerCase()) {
      setState('duplicate');
      return;
    }

    setState('loading');
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert([
        { email: trimmed, status: 'active' },
      ]);
      if (error) throw error;
      localStorage.setItem(STORAGE_KEY, trimmed.toLowerCase());
      setState('success');
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      setState('error');
    }
  };

  return (
    <section className="relative overflow-hidden bg-ent-ink text-white">
      <div className="ent-grid-bg absolute inset-0" aria-hidden="true" />
      <div className="container-custom relative section-padding py-14 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ent-gold">
            Stay in the loop
          </p>
          <h2 className="font-display mt-3 text-3xl font-extrabold md:text-4xl">
            Never miss a <span className="gradient-gold">highlight</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Event line-ups, fresh blog drops and campus stories — straight to your inbox, no spam.
          </p>

          {state === 'success' || state === 'duplicate' ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-ent-gold/40 bg-ent-gold/10 px-5 py-4">
              <Sparkles className="h-5 w-5 shrink-0 text-ent-gold" />
              <p className="text-sm font-semibold">
                {state === 'success'
                  ? "You're on the list — watch your inbox for the next highlight."
                  : "You're already subscribed — see you in the next drop."}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === 'error') setState('idle');
                  }}
                  placeholder="you@campus.edu"
                  aria-label="Email address"
                  className="h-12 border-white/15 bg-white/10 pl-10 text-white placeholder:text-white/40 focus-visible:border-ent-gold focus-visible:ring-ent-gold/40"
                />
              </div>
              <Button
                type="submit"
                disabled={state === 'loading'}
                className="h-12 bg-ent-gold px-7 font-bold text-ent-ink hover:bg-ent-gold-deep hover:text-white"
              >
                {state === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          )}

          {state === 'error' && (
            <p className="mt-3 text-sm font-medium text-red-300">
              Hmm, that didn't go through — check your email and try again.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
