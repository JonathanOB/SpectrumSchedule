'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  description: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof schema>;

interface RoutineFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function RoutineForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Create routine',
}: RoutineFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="routine-title" className="text-sm font-medium text-foreground">
          Title <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <input
          id="routine-title"
          type="text"
          placeholder="e.g. Morning Routine"
          autoFocus
          {...register('title')}
          aria-invalid={!!errors.title}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-[var(--radius-active,0.5rem)]',
            'bg-background border text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
            errors.title ? 'border-destructive' : 'border-border'
          )}
        />
        {errors.title && (
          <p role="alert" className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="routine-description" className="text-sm font-medium text-foreground">
          Description <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="routine-description"
          rows={2}
          placeholder="What is this routine for?"
          {...register('description')}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-[var(--radius-active,0.5rem)] resize-none',
            'bg-background border border-border text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1'
          )}
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
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
