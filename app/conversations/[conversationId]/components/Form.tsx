"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";
interface CloudinaryUploadWidgetInfo {
  secure_url?: string;
  // Add other properties if needed
}

interface CloudinaryUploadWidgetResults {
  info?: CloudinaryUploadWidgetInfo | string; // Allow info to be a string or the detailed object
}

const Form = () => {
  const { conversationId } = useConversation();
  const { register, handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    const secureUrl =
      typeof result.info === "string" ? result.info : result.info?.secure_url;

    if (secureUrl) {
      // Proceed with your API call
      axios
        .post("/api/messages", {
          image: secureUrl,
          conversationId,
        })
        .then((response) => {
          console.log("Upload successful:", response.data);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    } else {
      console.error("Secure URL is undefined");
    }
  };
  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="cuhhzfxy"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          type="input"
          id="message"
          register={register}
          required
          placeholder="Write a message..."
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 hover:bg-sky-600 cursor-pointer"
        >
          <HiPaperAirplane className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
