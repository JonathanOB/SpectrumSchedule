import type { ColorTheme, FontFamily, ScheduleColor, TaskIcon, TextSize } from '@/types';

export const COLOR_THEMES: { id: ColorTheme; label: string; preview: string }[] = [
  { id: 'calm-blue', label: 'Calm Blue', preview: '#2563eb' },
  { id: 'soft-green', label: 'Soft Green', preview: '#16a34a' },
  { id: 'warm-beige', label: 'Warm Beige', preview: '#d97706' },
  { id: 'lavender', label: 'Lavender', preview: '#7c3aed' },
  { id: 'dark', label: 'Dark Mode', preview: '#6366f1' },
  { id: 'high-contrast', label: 'High Contrast', preview: '#ffff00' },
];

export const FONT_OPTIONS: { id: FontFamily; label: string; description: string }[] = [
  { id: 'inter', label: 'Inter', description: 'Clean and modern' },
  {
    id: 'atkinson',
    label: 'Atkinson Hyperlegible',
    description: 'Designed for low vision readers',
  },
  { id: 'opendyslexic', label: 'OpenDyslexic', description: 'Helps with dyslexia' },
  { id: 'lexend', label: 'Lexend', description: 'Designed to reduce visual stress' },
];

export const TEXT_SIZES: { id: string; label: string }[] = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
  { id: 'extra-large', label: 'Extra Large' },
];

export const SCHEDULE_COLORS: ScheduleColor[] = [
  { label: 'Blue', value: 'blue', bg: '#dbeafe', text: '#1d4ed8' },
  { label: 'Green', value: 'green', bg: '#dcfce7', text: '#15803d' },
  { label: 'Purple', value: 'purple', bg: '#ede9fe', text: '#7c3aed' },
  { label: 'Orange', value: 'orange', bg: '#ffedd5', text: '#c2410c' },
  { label: 'Pink', value: 'pink', bg: '#fce7f3', text: '#be185d' },
  { label: 'Teal', value: 'teal', bg: '#ccfbf1', text: '#0f766e' },
  { label: 'Yellow', value: 'yellow', bg: '#fef9c3', text: '#a16207' },
  { label: 'Gray', value: 'gray', bg: '#f3f4f6', text: '#374151' },
];

export const TASK_ICONS: TaskIcon[] = [
  { id: 'wake-up', label: 'Wake Up', emoji: '🌅' },
  { id: 'brush-teeth', label: 'Brush Teeth', emoji: '🪥' },
  { id: 'shower', label: 'Shower', emoji: '🚿' },
  { id: 'breakfast', label: 'Breakfast', emoji: '🍳' },
  { id: 'lunch', label: 'Lunch', emoji: '🥗' },
  { id: 'dinner', label: 'Dinner', emoji: '🍽️' },
  { id: 'snack', label: 'Snack', emoji: '🍎' },
  { id: 'school', label: 'School', emoji: '🏫' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'exercise', label: 'Exercise', emoji: '🏃' },
  { id: 'medication', label: 'Medication', emoji: '💊' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🧘' },
  { id: 'play', label: 'Play', emoji: '🎮' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'shopping', label: 'Shopping', emoji: '🛒' },
  { id: 'chores', label: 'Chores', emoji: '🧹' },
  { id: 'bath', label: 'Bath', emoji: '🛁' },
  { id: 'sleep', label: 'Sleep', emoji: '😴' },
  { id: 'appointment', label: 'Appointment', emoji: '📅' },
  { id: 'transport', label: 'Transport', emoji: '🚌' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌳' },
  { id: 'social', label: 'Social', emoji: '👥' },
  { id: 'therapy', label: 'Therapy', emoji: '💬' },
  { id: 'water', label: 'Drink Water', emoji: '💧' },
  { id: 'pets', label: 'Pets', emoji: '🐾' },
  { id: 'hygiene', label: 'Hygiene', emoji: '🧼' },
  { id: 'task', label: 'Task', emoji: '✅' },
  { id: 'star', label: 'Special', emoji: '⭐' },
];

export const TEXT_SIZE_OPTIONS: Array<{ id: TextSize; label: string; size: string }> = [
  { id: 'small', label: 'Small', size: '14px' },
  { id: 'medium', label: 'Medium', size: '16px' },
  { id: 'large', label: 'Large', size: '18px' },
  { id: 'extra-large', label: 'Extra Large', size: '20px' },
];

export const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/today', label: "Today's Schedule" },
  { href: '/schedules', label: 'Schedules' },
  { href: '/routines', label: 'Routines' },
  { href: '/settings/accessibility', label: 'Accessibility' },
];
