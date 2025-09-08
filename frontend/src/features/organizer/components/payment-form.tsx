import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema } from '../schemas';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

type Step4Data = z.infer<typeof paymentSchema>;

export default function Step4Form({
  initial,
  onNext,
  onBack,
}: {
  initial?: Partial<Step4Data>;
  onNext: (data: Step4Data) => void;
  onBack?: () => void;
}) {
  const { register, handleSubmit, formState } = useForm<Step4Data>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentAccount: initial?.paymentAccount ?? '',
      vatNumber: initial?.vatNumber ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">
          Tài khoản thanh toán
        </label>
        <input {...register('paymentAccount')} className="mt-1 block w-full" />
        {formState.errors.paymentAccount && (
          <p className="text-sm text-red-500">
            {formState.errors.paymentAccount.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Mã số VAT (nếu có)</label>
        <input {...register('vatNumber')} className="mt-1 block w-full" />
      </div>

      <div className="flex gap-2 justify-end">
        {onBack && (
          <Button variant="outline" type="button" onClick={onBack}>
            Quay lại
          </Button>
        )}
        <Button type="submit">Hoàn tất</Button>
      </div>
    </form>
  );
}
