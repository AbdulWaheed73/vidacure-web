import img from "../assets/404.png";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center items-center px-4">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-center items-center gap-16">
        {/* Text Content */}
        <div className="w-full lg:w-[594px] flex flex-col justify-center items-center gap-16">
          <div className="w-full flex flex-col justify-start items-start gap-7">
            <div className="w-full text-center text-teal-900 text-8xl lg:text-[191px] font-bold leading-tight">
              404
            </div>
            <div className="w-full text-center text-teal-900 text-3xl lg:text-4xl font-normal leading-tight">
              We are Sorry.....
            </div>
            <div className="w-full text-center text-teal-900 text-xl lg:text-2xl font-normal leading-relaxed">
              Oops! The page you're looking for doesn't exist, was moved, or may
              have been deleted
            </div>
          </div>
          <button className="w-36 h-11 px-4 py-2 bg-teal-900 rounded-full flex justify-center items-center hover:bg-teal-800 transition-colors">
            <span className="text-white text-base font-semibold">
              Go Back
            </span>
          </button>
        </div>
        
        {/* Image Content */}
        <div className="w-full lg:w-[594px] flex justify-center items-center">
          <div className="w-full max-w-md lg:max-w-full">
            {/* Placeholder for your 404 illustration */}
            <div className="w-full aspect-square rounded-lg flex items-center justify-center">
                <img src={img} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;