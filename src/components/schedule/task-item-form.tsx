'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconPicker } from './icon-picker';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  icon: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  description: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof schema>;

interface TaskItemFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function TaskItemForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Add task',
}: TaskItemFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      icon: defaultValues?.icon ?? '',
      startTime: defaultValues?.startTime ?? '',
      endTime: defaultValues?.endTime ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const selectedIcon = watch('icon');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      {/* Icon + Title row */}
      <div className="flex items-start gap-2">
        <IconPicker
          value={selectedIcon}
          onChange={(emoji) => setValue('icon', emoji)}
        >
          <button
            type="button"
            className={cn(
              'size-11 rounded-[var(--radius-active,0.5rem)] border border-border',
              'text-xl flex items-center justify-center shrink-0',
              'hover:border-primary/50 transition-colors',
              'focus-visible:outline-2 focus-visible:outline-ring'
            )}
            title="Choose icon"
            aria-label="Choose icon"
          >
            {selectedIcon || '📋'}
          </button>
        </IconPicker>

        <div className="flex-1 space-y-1">
          <input
            type="text"
            placeholder="Task title *"
            autoFocus
            {...register('title')}
            aria-invalid={!!errors.title}
            className={cn(
              'w-full px-3 py-2 text-sm rounded-[var(--radius-active,0.5rem)]',
              'bg-background border text-foreground placeholder:text-muted-foreground',
              'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
              errors.title ? 'border-destructive' : 'border-border'
            )}
          />
          {errors.title && (
            <p role="alert" className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
      </div>

      {/* Time row */}
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <label htmlFor="start-time" className="text-xs text-muted-foreground">
            Start time
          </label>
          <input
            id="start-time"
            type="time"
            {...register('startTime')}
            className={cn(
              'w-full px-3 py-2 text-sm rounded-[var(--radius-active,0.5rem)]',
              'bg-background border border-border text-foreground',
              'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1'
            )}
          />
        </div>
        <div className="flex-1 space-y-1">
          <label htmlFor="end-time" className="text-xs text-muted-foreground">
            End time
          </label>
          <input
            id="end-time"
            type="time"
            {...register('endTime')}
            className={cn(
              'w-full px-3 py-2 text-sm rounded-[var(--radius-active,0.5rem)]',
              'bg-background border border-border text-foreground',
              'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1'
            )}
          />
        </div>
      </div>

      {/* Description */}
      <input
        type="text"
        placeholder="Note (optional)"
        {...register('description')}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-[var(--radius-active,0.5rem)]',
          'bg-background border border-border text-foreground placeholder:text-muted-foreground',
          'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1'
        )}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
