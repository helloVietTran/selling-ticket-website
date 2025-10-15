import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

import InfoForm from "@/features/create-event/components/info-form";
import TimeAndTicketForm from "@/features/create-event/components/time-ticket-type-form";
import SettingForm from "@/features/create-event/components/setting-form";
import PaymentForm from "@/features/create-event/components/payment-form";
import { type CreateEventFormData } from "@/features/create-event/schemas";
import CreateProcessBar from "@/features/create-event/components/create-process-bar";
import { useApi } from "@/api/hooks/useApi";
import { createFullEvent } from "@/api/eventApi";
import TOAST_MESSAGES from "@/constant/toast";
import type { CreateEventPayload } from "@/types";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: "eventInfo", label: "Thông tin sự kiện" }, // STEP 1
  { id: "timeAndTicketTypeInfo", label: "Thời gian & Loại vé" }, // STEP 2
  { id: "settingInfo", label: "Cài đặt" }, // STEP 3
  { id: "paymentInfo", label: "Thông tin thanh toán" }, // STEP 4
];

export default function CreateEventPage() {
  const [currentStepId, setCurrentStepId] = useState(steps[0].id);
  const [formData, setFormData] = useState<CreateEventFormData>({});

  const navigate = useNavigate();
  const { exec, error, isError, isSuccess } = useApi(createFullEvent);

  const handleNextFromStep = <T extends keyof CreateEventFormData>(
    stepId: T,
    data: CreateEventFormData[T]
  ) => {
    console.log(data)
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
    // fallback to empty string to avoid typesc checking error 
    const createEventData: CreateEventPayload = {
      organizer: finalData.eventInfo?.organizer ?? { organizerName: "", organizerInfo: "" },
      venue: finalData.eventInfo?.venue ?? { province: "", district: "", ward: "", street: "" },
      event: {
        ...finalData.eventInfo!,
        startTime: finalData.timeAndTicketTypeInfo?.startTime!,
        endTime: finalData.timeAndTicketTypeInfo?.endTime!,
      },
      ticketTypes: finalData.timeAndTicketTypeInfo?.ticketTypes || [],
      setting: {
        messageToReceiver: finalData.settingInfo?.messageToReceiver,
      },

      paymentInfo: finalData.paymentInfo!,
    };
    console.log("Final data to submit:", createEventData);
    await exec(createEventData);
  };

  const { CREATE_EVENT } = TOAST_MESSAGES;

  useEffect(() => {
    if (isError) {
      console.log("Error creating event:", error);
      toast.error(CREATE_EVENT.error.title, {
        description: CREATE_EVENT.error.description,
      });
    }

    if (isSuccess) {
      navigate('/organizer/events');
      toast.success(CREATE_EVENT.success.title, {
        description: CREATE_EVENT.success.description,
      });
    }

  }, [isSuccess, isError, error]);

  return (
    <Tabs value={currentStepId} onValueChange={setCurrentStepId}>
      <div
        className='bg-black/30 backdrop-blur-md border-b border-[#38383D] fixed z-49 px-16 pt-4 left-0 right-0 top-16'
      >
        <CreateProcessBar steps={steps} currentStepId={currentStepId} />
      </div>

      <div className="pt-30">
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
