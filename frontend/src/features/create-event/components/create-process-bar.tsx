import { cn } from '@/lib/utils';

type Step = { id: string; label: string };
type Props = {
  steps: Step[];
  currentStepId: string;
};

export default function CreateProcessBar({ steps, currentStepId }: Props) {
  const currentIndex = steps.findIndex(s => s.id === currentStepId);
  const total = steps.length;

  const currentStep = steps[currentIndex];

  return (
    <>
      {/* Mobile */}
      <div className="flex items-center justify-center gap-3 w-full pb-3 lg:hidden">
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold',
            'bg-white text-black border border-gray-300'
          )}
          aria-hidden>
          {currentIndex + 1}
        </div>

        <div className="text-sm text-white/95 text-center">
          <div className="font-medium">{currentStep?.label}</div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex w-full justify-between relative pb-3 bg-transparent border-b border-gray-700 px-4">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStepId;

          return (
            <div
              key={step.id}
              className="flex items-center gap-2 cursor-default"
              aria-current={isActive ? 'step' : undefined}>
              <span
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border transition',
                  isActive
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-black border-gray-400'
                )}>
                {idx + 1}
              </span>

              <span
                className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-white' : 'text-gray-400'
                )}>
                {step.label}
              </span>
            </div>
          );
        })}

        {/* Progress bar */}
        <span
          className="absolute bottom-0 left-0 h-[2px] bg-green-500 transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / total) * 100}%`,
          }}
        />
      </div>
    </>
  );
}
