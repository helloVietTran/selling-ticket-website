import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import InfoForm from "@/features/create-event/components/info-form";
import TimeAndTicketForm from "@/features/create-event/components/time-ticket-type-form";
import SettingForm from "@/features/create-event/components/setting-form";
import PaymentForm from "@/features/create-event/components/payment-form";
import { type CreateEventFormData } from "@/features/create-event/schemas";
import CreateProcessBar from "@/features/create-event/components/create-process-bar";
import { useApi } from "@/api/hooks/useApi";
import { createFullEvent } from "@/api/eventApi";

const steps = [
  { id: "eventInfo", label: "Thông tin sự kiện" }, // STEP 1
  { id: "timeAndTicketTypeInfo", label: "Thời gian & Loại vé" }, // STEP 2
  { id: "settingInfo", label: "Cài đặt" }, // STEP 3
  { id: "paymentInfo", label: "Thông tin thanh toán" }, // STEP 4
];

export default function CreateEventPage() {
  const [currentStepId, setCurrentStepId] = useState(steps[0].id);
  const [formData, setFormData] = useState<CreateEventFormData>({});

  const { exec, error, data } = useApi(createFullEvent);

  const handleNextFromStep = <T extends keyof CreateEventFormData>(
    stepId: T,
    data: CreateEventFormData[T]
  ) => {

    const updatedData = { ...formData, [stepId]: data };
    setFormData(updatedData);

    const idx = steps.findIndex(s => s.id === stepId);

    if (idx < steps.length - 1) {
      setCurrentStepId(steps[idx + 1].id);
    } else {
      handleFinish(updatedData);
    }
  };

  const handleFinish = async (finalData: CreateEventFormData) => {
    // format to easy handle
    const creatEventData = {
      organizer: finalData.eventInfo?.organizer,
      venue: finalData.eventInfo?.venue,
      event: {
        ...finalData.eventInfo,
        startTime: finalData.timeAndTicketTypeInfo?.startTime,
        endTime: finalData.timeAndTicketTypeInfo?.endTime,
      },
      tickeTypes: finalData.timeAndTicketTypeInfo?.ticketTypes,
      setting: {
        messageToReceiver: finalData.settingInfo?.messageToReceiver
      },
      paymentInfo: finalData.paymentInfo
    };

    console.log(creatEventData);
    await exec(creatEventData);

    if (error) {
      alert("Gọi lỗi")
      console.log(error)

    } else {
      alert("ok")
    }


  };

  return (
    <Tabs value={currentStepId} onValueChange={setCurrentStepId}>
      <div
        className="
          bg-black/30 backdrop-blur-md border-b border-[#38383D]
          fixed top-[72px] z-49 pt-6
          left-0 right-0
          min-[1150px]:left-[288px] 
          min-[1150px]:w-[calc(100%-288px)] w-full
        "
      >
        <CreateProcessBar steps={steps} currentStepId={currentStepId} />
      </div>

      <div className="pt-16">
        <TabsContent value="eventInfo">
          <InfoForm
            initial={formData.eventInfo}
            onNext={(data) => handleNextFromStep("eventInfo", data)}
          />

        </TabsContent>

        <TabsContent value="timeAndTicketTypeInfo">
          <TimeAndTicketForm
            initial={formData.timeAndTicketTypeInfo}
            onBack={() => setCurrentStepId("eventInfo")}
            onNext={(data) => handleNextFromStep("timeAndTicketTypeInfo", data)}
          />
        </TabsContent>

        <TabsContent value="settingInfo">
          <SettingForm
            initial={formData.settingInfo}
            onBack={() => setCurrentStepId("timeAndTicketTypeInfo")}
            onNext={(data) => handleNextFromStep("settingInfo", data)}
          />
        </TabsContent>

        <TabsContent value="paymentInfo">
          <PaymentForm
            initial={formData.paymentInfo}
            onBack={() => setCurrentStepId("settingInfo")}
            onNext={(data) => handleNextFromStep("paymentInfo", data)}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
