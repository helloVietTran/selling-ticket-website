import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingSchema } from '../schemas';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

type Step3Data = z.infer<typeof settingSchema>;

export default function Step3Form({
  initial,
  onNext,
  onBack,
}: {
  initial?: Partial<Step3Data>;
  onNext: (data: Step3Data) => void;
  onBack?: () => void;
}) {
  const { register, handleSubmit } = useForm<Step3Data>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      isPublic: initial?.isPublic ?? false,
      allowSharing: initial?.allowSharing ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('isPublic')} />
        Sự kiện công khai
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('allowSharing')} />
        Cho phép chia sẻ
      </label>

      <div className="flex gap-2 justify-end">
        {onBack && (
          <Button variant="outline" type="button" onClick={onBack}>
            Quay lại
          </Button>
        )}
        <Button type="submit">Tiếp theo</Button>
      </div>
    </form>
  );
}
