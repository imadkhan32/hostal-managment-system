import { ThemeAccent } from '../types';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  badge: string;
  border: string;
  ring: string;
  text: string;
}

export const THEME_CONFIG: Record<ThemeAccent, ThemeColors> = {
  emerald: {
    primary: 'bg-emerald-600 dark:bg-emerald-500',
    primaryHover: 'hover:bg-emerald-700 dark:hover:bg-emerald-600',
    primaryLight: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
    border: 'border-emerald-500',
    ring: 'focus:ring-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  indigo: {
    primary: 'bg-indigo-600 dark:bg-indigo-500',
    primaryHover: 'hover:bg-indigo-700 dark:hover:bg-indigo-600',
    primaryLight: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
    badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
    border: 'border-indigo-500',
    ring: 'focus:ring-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
  crimson: {
    primary: 'bg-rose-600 dark:bg-rose-500',
    primaryHover: 'hover:bg-rose-700 dark:hover:bg-rose-600',
    primaryLight: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
    badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800',
    border: 'border-rose-500',
    ring: 'focus:ring-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
  },
  amber: {
    primary: 'bg-amber-600 dark:bg-amber-500',
    primaryHover: 'hover:bg-amber-700 dark:hover:bg-amber-600',
    primaryLight: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    border: 'border-amber-500',
    ring: 'focus:ring-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
};
