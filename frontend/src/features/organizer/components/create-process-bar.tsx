// src/features/organizer/components/create-process-bar.tsx
'use client';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type Step = { id: string; label: string };
type Props = {
  steps: Step[];
  currentStepId: string;
  onChange: (stepId: string) => void;
  validatedSteps: string[]; // danh sách id đã validate
};

export default function CreateProcessBar({
  steps,
  currentStepId,
  onChange,
  validatedSteps,
}: Props) {
  const isAllowed = (stepId: string) => {
    return stepId === currentStepId || validatedSteps.includes(stepId);
  };

  return (
    <TabsList className="flex w-full justify-between relative pb-2 bg-transparent border-b border-gray-700">
      {steps.map((step, idx) => {
        const allowed = isAllowed(step.id);
        return (
          <TabsTrigger
            key={step.id}
            value={step.id}
            onClick={() => {
              if (allowed) onChange(step.id);
            }}
            className={cn(
              'flex items-center gap-2 bg-transparent shadow-none pb-4',
              'data-[state=active]:shadow-none data-[state=active]:bg-transparent',
              !allowed && 'opacity-40 cursor-not-allowed'
            )}
            data-state={currentStepId === step.id ? 'active' : 'inactive'}
            disabled={!allowed}
          >
            <span
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border transition',
                currentStepId === step.id
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-black border-gray-400'
              )}
            >
              {idx + 1}
            </span>

            <span
              className={cn(
                'text-sm font-medium',
                currentStepId === step.id ? 'text-white' : 'text-gray-400'
              )}
            >
              {step.label}
            </span>
          </TabsTrigger>
        );
      })}

      <span
        className="absolute bottom-0 left-0 h-[2px] bg-green-500 transition-all duration-300"
        style={{
          width: `${((steps.findIndex(s => s.id === currentStepId) + 1) /
            steps.length) *
            100}%`,
        }}
      />
    </TabsList>
  );
}
