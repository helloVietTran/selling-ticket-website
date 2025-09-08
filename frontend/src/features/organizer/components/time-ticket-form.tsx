import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { timeAndTicketTypeSchema } from '../schemas';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

type Step2Data = z.infer<typeof timeAndTicketTypeSchema>;

export default function Step2Form({
  initial,
  onNext,
  onBack,
}: {
  initial?: Partial<Step2Data>;
  onNext: (d: Step2Data) => void;
  onBack?: () => void;
}) {
  const { register, control, handleSubmit, formState } = useForm<Step2Data>({
    resolver: zodResolver(timeAndTicketTypeSchema),
    defaultValues: {
      startDate: initial?.startDate ?? '',
      endDate: initial?.endDate ?? '',
      tickets: initial?.tickets ?? [{ name: '', price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tickets',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div>
        <label>Start</label>
        <input {...register('startDate')} />
        {formState.errors.startDate && (
          <div>{(formState.errors.startDate as any).message}</div>
        )}
      </div>

      <div>
        <label>End</label>
        <input {...register('endDate')} />
      </div>

      <div>
        <label>Tickets</label>
        {fields.map((f, idx) => (
          <div key={f.id} className="flex gap-2 items-center">
            <input
              {...register(`tickets.${idx}.name` as const)}
              placeholder="Name"
            />
            <input
              type="number"
              {...register(`tickets.${idx}.price` as const, {
                valueAsNumber: true,
              })}
              placeholder="Price"
            />
            <button type="button" onClick={() => remove(idx)}>
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append({ name: '', price: 0 })}>
          Thêm vé
        </button>
      </div>

      <div className="flex gap-2 justify-end">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
        )}
        <Button type="submit">Tiếp theo</Button>
      </div>
    </form>
  );
}
