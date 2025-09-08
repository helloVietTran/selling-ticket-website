
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import InfoForm from "@/features/organizer/components/info-form";
import Step2Form from "@/features/organizer/components/time-ticket-form";
import Step3Form from "@/features/organizer/components/setting-form";
import Step4Form from "@/features/organizer/components/payment-form";
import type { FormDataByStep } from "@/features/organizer/schemas";
import CreateProcessBar from "@/features/organizer/components/create-process-bar";


const steps = [
  { id: "step1", label: "Thông tin sự kiện" },
  { id: "step2", label: "Thời gian & Loại vé" },
  { id: "step3", label: "Cài đặt" },
  { id: "step4", label: "Thông tin thanh toán" },
];

export default function CreateEventPage() {
  const [currentStepId, setCurrentStepId] = useState(steps[0].id);
  const [validatedSteps, setValidatedSteps] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormDataByStep>({});

  const markValidated = (stepId: string) => {
    setValidatedSteps(prev => Array.from(new Set([...prev, stepId])));
  };

  const handleNextFromStep = <T extends keyof FormDataByStep>(
    stepId: T,
    data: FormDataByStep[T]
  ) => {
    console.log(data);

    setFormData(prev => ({ ...prev, [stepId]: data }));
    markValidated(stepId as string);

    const idx = steps.findIndex(s => s.id === stepId);
    if (idx < steps.length - 1) {
      setCurrentStepId(steps[idx + 1].id);
    } else {
      handleFinish({ ...formData, [stepId]: data });
    }
  };

  const handleFinish = (finalData: any) => {
    console.log("Submit toàn bộ dữ liệu:", finalData);
  };

  return (
    <Tabs value={currentStepId} onValueChange={(v) => {
      // chỉ cho thay đổi nếu target đã được validated
      if (validatedSteps.includes(v) || v === currentStepId) {
        setCurrentStepId(v);
      }
    }}>
      <div className="bg-black/30 backdrop-blur-md border-b border-[#38383D] fixed w-[calc(100%-288px)] top-[72px] z-50 right-0 flex items-center justify-center gap-4">
        <div className="flex-1 pt-6">
          <CreateProcessBar
            steps={steps}
            currentStepId={currentStepId}
            onChange={(id) => {
              // chỉ thay đổi nếu đã validated (component đã kiểm tra nữa)
              if (validatedSteps.includes(id) || id === currentStepId) setCurrentStepId(id);
            }}
            validatedSteps={validatedSteps}
          />
        </div>

        <div className="flex items-center gap-4 flex-none">
          <Button variant="outline" className="cursor-pointer px-4 py-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50">
            Lưu
          </Button>

          <Button className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600">
            Áp dụng
          </Button>
        </div>
      </div>

      <div className="pt-16">
        <TabsContent value="step1">
          <InfoForm
            initial={formData.step1}
            onNext={(data) => handleNextFromStep("step1", data)}
          />
        </TabsContent>

        <TabsContent value="step2">
          <Step2Form
            initial={formData.step2}
            onBack={() => setCurrentStepId("step1")}
            onNext={(data) => handleNextFromStep("step2", data)}
          />
        </TabsContent>

        <TabsContent value="step3">
          <Step3Form
            initial={formData.step3}
            onBack={() => setCurrentStepId("step2")}
            onNext={(data) => handleNextFromStep("step3", data)}
          />
        </TabsContent>

        <TabsContent value="step4">
          <Step4Form
            initial={formData.step4}
            onBack={() => setCurrentStepId("step3")}
            onNext={(data) => handleNextFromStep("step4", data)}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
