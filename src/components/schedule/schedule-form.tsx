'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SCHEDULE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Schedule } from '@/types';
import { Button } from '@/components/ui/button';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(80, 'Title must be under 80 characters'),
  description: z.string().max(200, 'Description must be under 200 characters').optional(),
  color: z.string().min(1, 'Please choose a colour'),
});

type FormValues = z.infer<typeof schema>;

interface ScheduleFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function ScheduleForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Create schedule',
}: ScheduleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      color: defaultValues?.color ?? 'blue',
    },
  });

  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="schedule-title" className="text-sm font-medium text-foreground">
          Title <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <input
          id="schedule-title"
          type="text"
          placeholder="e.g. Morning Routine"
          autoFocus
          {...register('title')}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-[var(--radius-active,0.5rem)]',
            'bg-background border text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
            errors.title ? 'border-destructive' : 'border-border'
          )}
        />
        {errors.title && (
          <p id="title-error" role="alert" className="text-xs text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="schedule-description" className="text-sm font-medium text-foreground">
          Description <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <textarea
          id="schedule-description"
          rows={2}
          placeholder="What is this schedule for?"
          {...register('description')}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-[var(--radius-active,0.5rem)] resize-none',
            'bg-background border border-border text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1'
          )}
        />
      </div>

      {/* Colour */}
      <fieldset>
        <legend className="text-sm font-medium text-foreground mb-2">
          Colour <span className="text-destructive" aria-hidden="true">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {SCHEDULE_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setValue('color', c.value, { shouldValidate: true })}
              aria-pressed={selectedColor === c.value}
              aria-label={c.label}
              className={cn(
                'size-9 rounded-full border-2 transition-all cursor-pointer',
                selectedColor === c.value
                  ? 'border-foreground scale-110 ring-2 ring-ring ring-offset-2'
                  : 'border-transparent hover:border-foreground/30'
              )}
              style={{ backgroundColor: c.text }}
            />
          ))}
        </div>
        {errors.color && (
          <p role="alert" className="text-xs text-destructive mt-1">
            {errors.color.message}
          </p>
        )}
      </fieldset>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
