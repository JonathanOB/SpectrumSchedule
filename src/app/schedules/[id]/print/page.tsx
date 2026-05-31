import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { formatTime } from '@/lib/utils';
import { getSchedule } from '@/actions/schedule-actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const schedule = await getSchedule(id);
  return { title: schedule ? `Print: ${schedule.title}` : 'Print Schedule' };
}

export default async function PrintSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const schedule = await getSchedule(id);
  if (!schedule) notFound();

  const items = [...(schedule.items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <html lang="en">
      <head>
        <title>{schedule.title} — Spectrum Schedule</title>
        <style>{`
          @page { margin: 1.5cm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #111; background: white; }
          header { border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
          h1 { font-size: 22px; font-weight: bold; }
          .subtitle { color: #555; margin-top: 4px; font-size: 13px; }
          .branding { font-size: 11px; color: #888; margin-top: 4px; }
          .task { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .task:last-child { border-bottom: none; }
          .task-num { font-size: 12px; color: #888; width: 20px; shrink: 0; padding-top: 2px; }
          .task-icon { font-size: 20px; width: 28px; text-align: center; }
          .task-content { flex: 1; }
          .task-title { font-weight: 600; font-size: 15px; }
          .task-desc { font-size: 12px; color: #555; margin-top: 2px; }
          .task-time { font-size: 12px; color: #777; margin-top: 3px; }
          .checkbox { width: 20px; height: 20px; border: 2px solid #999; border-radius: 4px; shrink: 0; margin-top: 2px; }
          .progress { margin-top: 12px; }
          .progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; margin-top: 4px; }
          .progress-fill { height: 100%; background: #2563eb; border-radius: 4px; }
          @media print {
            .no-print { display: none !important; }
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        `}</style>
      </head>
      <body>
        <header>
          <h1>{schedule.title}</h1>
          {schedule.description && <p className="subtitle">{schedule.description}</p>}
          <p className="branding">
            Spectrum Schedule · {items.length} task{items.length !== 1 ? 's' : ''}
          </p>

          {items.length > 0 && (
            <div className="progress">
              <span style={{ fontSize: 12, color: '#555' }}>
                {items.filter((i) => i.completed).length} / {items.length} completed
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.round((items.filter((i) => i.completed).length / items.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </header>

        <main>
          {items.map((item, i) => (
            <div key={item.id} className="task">
              <span className="task-num">{i + 1}.</span>
              <span className="task-icon">{item.icon ?? '📋'}</span>
              <div className="task-content">
                <p className="task-title" style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                  {item.title}
                </p>
                {item.description && <p className="task-desc">{item.description}</p>}
                {(item.startTime || item.endTime) && (
                  <p className="task-time">
                    {item.startTime && item.endTime
                      ? `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`
                      : item.startTime
                      ? formatTime(item.startTime)
                      : ''}
                  </p>
                )}
              </div>
              <div className="checkbox" aria-hidden="true" />
            </div>
          ))}
        </main>

        <script
          dangerouslySetInnerHTML={{
            __html: 'window.onload = () => window.print();',
          }}
        />
      </body>
    </html>
  );
}
