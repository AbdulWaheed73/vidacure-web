import React from "react";
import { ArrowLeft } from "lucide-react";
import bankId from "../assets/bankId.png";
import vidaCure from "../assets/vidacure_png.png";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onLogin: () => void;
  loading: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen relative bg-emerald-50 overflow-hidden">
      {/* Header */}
      <div className="w-full  left-0 top-0 absolute bg-white shadow-sm flex flex-col justify-center items-start">
        <div className="w-full max-w-screen-xl mx-auto py-5 flex justify-start items-center gap-8">
          <div
            className="w-6 h-6 relative overflow-hidden"
            onClick={() => {
              navigate("/");
            }}
          >
            <ArrowLeft className="w-4 h-4 absolute left-1 top-1 text-zinc-800" />
          </div>
          <div className="flex justify-start items-center">
            <img className="w-36 h-5" src={vidaCure} alt="VidaCure Logo" />
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-[806px] px-12 py-16 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-white rounded-2xl shadow-lg border border-stone-50 flex flex-col justify-center items-center gap-8">
        {/* Close Button - Top Left of Card */}
        <div
          className="w-10 h-10 p-1 left-8 top-8 absolute bg-zinc-800 rounded-full flex justify-center items-center overflow-hidden"
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowLeft className="text-white w-5 h-5" />
        </div>

        {/* Header Text */}
        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="self-stretch text-center text-zinc-800 text-4xl font-bold leading-10">
            Continue with BankID
          </div>
          <div className="self-stretch text-center text-zinc-800 text-base font-normal leading-snug">
            The safe path to sustainable weight loss and better health.
          </div>
        </div>

        {/* BankID Button */}
        <div className="self-stretch flex flex-col justify-center items-center gap-2.5">
          <button
            onClick={onLogin}
            disabled={loading}
            className="p-3.5 bg-white rounded-[10px] shadow-md border border-gray-200 flex justify-center items-center gap-3.5 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img className="w-10 h-9" src={bankId} alt="BankID" />
            <div className="text-black/50 text-xl font-medium">
              {loading ? "Connecting..." : "Identify with BankID"}
            </div>
          </button>
        </div>

        <div className="self-stretch h-px bg-zinc-400 rounded-full" />

        <div className="w-72 text-center">
          <span className="text-black text-xs font-normal leading-none">
            * By continuing, you agree to our{" "}
          </span>
          <button className="text-black text-xs font-bold underline leading-none hover:text-zinc-700 transition-colors">
            Terms of Service
          </button>
          <span className="text-black text-xs font-normal leading-none">
            {" "}
            and{" "}
          </span>
          <button className="text-black text-xs font-bold underline leading-none hover:text-zinc-700 transition-colors">
            Privacy Policy
          </button>
          <span className="text-black text-xs font-normal leading-none">.</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
