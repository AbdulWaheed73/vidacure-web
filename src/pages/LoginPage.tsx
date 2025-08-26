import React from "react";
import { Button } from "../components/ui";
import { getClientType } from "../utils";
import { ArrowLeft } from "lucide-react";
import bankId from "../assets/bankId.png";
import vidaCure from "../assets/vidacure_png.png";
interface LoginPageProps {
  onLogin: () => void;
  loading: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, loading }) => {
  return (
    <div className="w-full h-[1024px] relative bg-emerald-50 overflow-hidden">
      <div className="w-full px-5 left-0 top-0 absolute bg-white shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] inline-flex flex-col justify-center items-start gap-2.5">
        <div className="w-[1280px] p-5 inline-flex justify-start items-center gap-8">
          <div className="size-6 relative overflow-hidden">
            <div className="size-4 left-[4px] top-[4px] absolute ">
              {" "}
              <ArrowLeft />{" "}
            </div>
          </div>
          <div className="size- relative flex justify-start items-center gap-12">
            <img className="w-36 h-6 left-0 top-0 absolute" src={vidaCure} />
          </div>
        </div>
      </div>
      <div className="w-[806px] px-12 py-16 left-[317px] top-[295.32px] absolute bg-white rounded-2xl shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] outline outline-stone-50 inline-flex flex-col justify-center items-center gap-8">
        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="self-stretch text-center justify-center text-zinc-800 text-4xl font-bold font-['Sora'] leading-10">
            Continue with BankID
          </div>
          <div className="self-stretch text-center justify-center text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
            The safe path to sustainable weight loss and better health.
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-center items-center gap-2.5">
          <div className="size- p-3.5 bg-white rounded-[10px] shadow-[0px_2px_3px_0px_rgba(0,0,0,0.17)] inline-flex justify-center items-center gap-3.5">
            <img className="w-10 h-9" src={bankId} />
            <div
              className="justify-start text-black/50 text-xl font-medium font-['Roboto']"
              onClick={onLogin}
            >
              Identify with BankID
            </div>
          </div>
        </div>
        <div className="self-stretch h-px bg-zinc-400 rounded-full" />
        <div className="w-72 text-center justify-center">
          <span className="text-black text-xs font-normal font-['Manrope'] leading-none">
            * By continuing, you agree to our{" "}
          </span>
          <span className="text-black text-xs font-bold font-['Manrope'] underline leading-none">
            Terms of Service
          </span>
          <span className="text-black text-xs font-normal font-['Manrope'] leading-none">
            {" "}
            and{" "}
          </span>
          <span className="text-black text-xs font-bold font-['Manrope'] underline leading-none">
            Privacy Policy
          </span>
          <span className="text-black text-xs font-normal font-['Manrope'] leading-none">
            .
          </span>
        </div>
        <div className="size-10 p-1 left-[32px] top-[31.68px] absolute bg-zinc-800 rounded-full inline-flex justify-center items-center gap-2.5 overflow-hidden">
          <div>
            <ArrowLeft className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
