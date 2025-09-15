import { useEffect, useMemo, useRef, useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FormFieldProps = {
  value?: string | null;
  onChange: (v: string) => void;
};

type DateTimePickerProps = {
  field: FormFieldProps;
  onClose?: () => void;
};
const DateTimePicker: React.FC<DateTimePickerProps> = ({ field, onClose }) => {
  const initial = useMemo(() => {
    if (!field?.value) return null;
    const d = new Date(field.value);
    return isNaN(d.getTime()) ? null : d;
  }, [field?.value]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initial ?? new Date()
  );
  const [hour, setHour] = useState<number>(
    initial ? initial.getHours() : new Date().getHours()
  );
  const [minute, setMinute] = useState<number>(
    initial ? initial.getMinutes() : new Date().getMinutes()
  );

  const hourListRef = useRef<HTMLDivElement | null>(null);
  const minuteListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      const el = hourListRef.current?.querySelector<HTMLDivElement>(
        `[data-hour="${hour}"]`
      );
      if (el) el.scrollIntoView({ block: 'center' });
      const el2 = minuteListRef.current?.querySelector<HTMLDivElement>(
        `[data-minute="${minute}"]`
      );
      if (el2) el2.scrollIntoView({ block: 'center' });
    });
  }, [hour, minute]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const pad2 = (n: number) => String(n).padStart(2, '0');

  const confirm = () => {
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    d.setHours(hour, minute, 0, 0);
    field.onChange(d.toISOString());
    if (onClose) onClose();
  };

  const setNow = () => {
    const now = new Date();
    setSelectedDate(now);
    setHour(now.getHours());
    setMinute(now.getMinutes());
    field.onChange(now.toISOString());
    if (onClose) onClose();
  };

  return (
    <div className="flex gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={d => d && setSelectedDate(d)}
      />

      <div className="w-40 flex flex-col p-5">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="text-sm mb-2 px-1">Giờ</div>
            <div
              ref={hourListRef}
              className="h-40 overflow-y-auto rounded border p-1"
              role="listbox"
              aria-label="Chọn giờ">
              {hours.map(h => (
                <div
                  key={h}
                  data-hour={h}
                  role="option"
                  aria-selected={h === hour}
                  tabIndex={0}
                  onClick={() => setHour(h)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') setHour(h);
                  }}
                  className={cn(
                    'cursor-pointer select-none rounded px-2 py-1 text-center',
                    h === hour ? 'bg-primary text-white' : 'hover:bg-accent'
                  )}>
                  {pad2(h)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm mb-2 px-1">Phút</div>
            <div
              ref={minuteListRef}
              className="h-40 overflow-y-auto rounded border p-1"
              role="listbox"
              aria-label="Chọn phút">
              {minutes.map(m => (
                <div
                  key={m}
                  data-minute={m}
                  role="option"
                  aria-selected={m === minute}
                  tabIndex={0}
                  onClick={() => setMinute(m)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') setMinute(m);
                  }}
                  className={cn(
                    'cursor-pointer select-none rounded px-2 py-1 text-center',
                    m === minute ? 'bg-primary text-white' : 'hover:bg-accent'
                  )}>
                  {pad2(m)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-2">
          <Button type="button" size="sm" onClick={confirm} className="flex-1">
            OK
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={setNow}>
            Hiện tại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
