import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import bankId from "../assets/bankId.png";
import vidaCure from "../assets/vidacure_png.png";
import { useNavigate } from "react-router-dom";
import type { LoginPageProps } from '../types';


export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, loading }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-screen relative bg-emerald-50 overflow-hidden">
      {/* Header */}
      <div className="w-full left-0 top-0 absolute bg-white shadow-sm flex flex-col justify-center items-start z-10">
        <div className="w-full max-w-7xl mx-auto py-3 px-4 sm:py-5 sm:px-6 flex justify-start items-center gap-4 sm:gap-8">
          <div
            className="w-6 h-6 relative overflow-hidden cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <ArrowLeft className="w-4 h-4 absolute left-1 top-1 text-zinc-800" />
          </div>
          <div className="flex justify-start items-center">
            <img className="w-28 h-4 sm:w-36 sm:h-5" src={vidaCure} alt="VidaCure Logo" />
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-2xl px-6 py-8 sm:px-8 md:px-12 sm:py-12 md:py-16 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-white rounded-xl sm:rounded-2xl shadow-lg border border-stone-50 flex flex-col justify-center items-center gap-6 sm:gap-8">
        {/* Close Button - Top Left of Card */}
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 p-1 left-4 top-4 sm:left-6 sm:top-6 md:left-8 md:top-8 absolute bg-zinc-800 rounded-full flex justify-center items-center overflow-hidden cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowLeft className="text-white w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        {/* Header Text */}
        <div className="self-stretch flex flex-col justify-center items-center gap-3 sm:gap-4">
          <div className="self-stretch text-center text-zinc-800 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight sm:leading-10">
            {t('login.title')}
          </div>
          <div className="self-stretch text-center text-zinc-800 text-sm sm:text-base font-normal leading-relaxed sm:leading-snug px-2">
            {t('login.description')}
          </div>
        </div>

        {/* BankID Button */}
        <div className="self-stretch flex flex-col justify-center items-center gap-2.5">
          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full max-w-sm p-3 sm:p-3.5 bg-white rounded-[10px] shadow-md border border-gray-200 flex justify-center items-center gap-3 sm:gap-3.5 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img className="w-8 h-7 sm:w-10 sm:h-9" src={bankId} alt="BankID" />
            <div className="text-black/50 text-lg sm:text-xl font-medium">
              {loading ? t('login.connecting') : t('login.bankIdButton')}
            </div>
          </button>
        </div>

        <div className="self-stretch h-px bg-zinc-400 rounded-full" />

        <div className="w-full max-w-xs sm:max-w-sm text-center px-4">
          <span className="text-black text-xs font-normal leading-relaxed">
            {t('login.termsPrefix')}
          </span>
          <button className="text-black text-xs font-bold underline leading-relaxed hover:text-zinc-700 transition-colors">
            {t('login.termsOfService')}
          </button>
          <span className="text-black text-xs font-normal leading-relaxed">
            {t('login.and')}
          </span>
          <button className="text-black text-xs font-bold underline leading-relaxed hover:text-zinc-700 transition-colors">
            {t('login.privacyPolicy')}
          </button>
          <span className="text-black text-xs font-normal leading-relaxed">.</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
