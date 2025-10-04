import { useTranslation } from "react-i18next";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { CloudinaryImages } from "@/lib/cloudinaryImages";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center items-center px-4">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-center items-center gap-16">
        {/* Text Content */}
        <div className="w-full lg:w-[594px] flex flex-col justify-center items-center gap-16">
          <div className="w-full flex flex-col justify-start items-start gap-7">
            <div className="w-full text-center text-teal-900 text-8xl lg:text-[191px] font-bold leading-tight">
              {t('notFound.title')}
            </div>
            <div className="w-full text-center text-teal-900 text-3xl lg:text-4xl font-normal leading-tight">
              {t('notFound.subtitle')}
            </div>
            <div className="w-full text-center text-teal-900 text-xl lg:text-2xl font-normal leading-relaxed">
              {t('notFound.description')}
            </div>
          </div>
          <button className="w-36 h-11 px-4 py-2 bg-teal-900 rounded-full flex justify-center items-center hover:bg-teal-800 transition-colors">
            <span className="text-white text-base font-semibold">
              {t('notFound.goBack')}
            </span>
          </button>
        </div>
        
        {/* Image Content */}
        <div className="w-full lg:w-[594px] flex justify-center items-center">
          <div className="w-full max-w-md lg:max-w-full">
            <div className="w-full aspect-square rounded-lg flex items-center justify-center">
              <OptimizedImage
                publicId={CloudinaryImages.notFound}
                alt="404 Not Found"
                width={594}
                className="w-full h-auto"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;