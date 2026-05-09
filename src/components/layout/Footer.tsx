import { Facebook, Instagram, Mail } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.79a8.16 8.16 0 0 0 4.77 1.52V6.85a4.85 4.85 0 0 1-1.84-.16Z"/>
  </svg>
);
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import footer from "../../assets/footer_logo.png";
import { useCookieConsentStore } from '@/stores/cookieConsentStore';

const FooterSection = () => {
  const { t } = useTranslation();
  const { openPreferences } = useCookieConsentStore();

  const footerSections = [
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.aboutUs'), href: ROUTES.ABOUT_US },
        { name: t('footer.ourDoctors'), href: `${ROUTES.ABOUT_US}#team` },
        { name: t('footer.blogs'), href: '#education' }
      ]
    },
    {
      title: t('footer.platform'),
      links: [
        { name: t('footer.forDoctors'), href: ROUTES.LOGIN },
        { name: t('footer.forPatients'), href: ROUTES.PRE_LOGIN_BMI }
      ]
    },
    {
      title: t('footer.program'),
      links: [
        { name: t('footer.howItWorks'), href: '#the-treatment' },
        { name: t('footer.pricing'), href: '#pricing' }
      ]
    },
    {
      title: t('footer.legal'),
      links: [
        { name: t('footer.privacyPolicy'), href: '/privacy' },
        { name: t('footer.termsOfService'), href: '/privacy' },
        { name: t('footer.cookieSettings', 'Cookie Settings'), href: '#cookie-settings', onClick: openPreferences }
      ]
    }
  ];

  const socialIcons = [
    { icon: Facebook, href: "https://facebook.com/vidacure", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/vidacure", label: "Instagram" },
    { icon: TikTokIcon, href: "https://tiktok.com/@vidacure", label: "TikTok" }
  ];

  // const certifications = [
  //   {
  //     src: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=80&h=86&fit=crop",
  //     alt: "Medical Certification 1",
  //     className: "w-20 h-[86px]"
  //   },
  //   {
  //     src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=140&h=52&fit=crop",
  //     alt: "Medical Certification 2", 
  //     className: "w-36 h-14"
  //   },
  //   {
  //     src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=140&h=49&fit=crop",
  //     alt: "Medical Certification 3",
  //     className: "w-36 h-12"
  //   }
  // ];

  type FooterLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  };

  const FooterLink = ({ href, children, className = "", onClick }: FooterLinkProps) => {
    // Button with onClick handler
    if (onClick) {
      return (
        <button
          onClick={onClick}
          className={`text-emerald-50 text-base font-normal font-inter leading-normal hover:text-white transition-colors duration-200 text-left ${className}`}
        >
          {children}
        </button>
      );
    }

    // Hash link (in-page navigation)
    if (href.startsWith('#')) {
      return (
        <a
          href={href}
          className={`text-emerald-50 text-base font-normal font-inter leading-normal hover:text-white transition-colors duration-200 ${className}`}
        >
          {children}
        </a>
      );
    }

    // External link
    if (href.startsWith('http')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-emerald-50 text-base font-normal font-inter leading-normal hover:text-white transition-colors duration-200 ${className}`}
        >
          {children}
        </a>
      );
    }

    // Internal route
    return (
      <Link
        to={href}
        className={`text-emerald-50 text-base font-normal font-inter leading-normal hover:text-white transition-colors duration-200 ${className}`}
      >
        {children}
      </Link>
    );
  };

  type SocialIconProps = {
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    label: string;
  };
  
  const SocialIcon = ({ icon: Icon, href, label }: SocialIconProps) => (
    <a
      href={href}
      aria-label={label}
      className="w-6 h-6 flex justify-center items-center hover:scale-110 transition-transform duration-200"
    >
      <Icon className="w-4 h-4 text-emerald-50 hover:text-white transition-colors duration-200" />
    </a>
  );

  const ContactBlock = ({ align = 'left' }: { align?: 'left' | 'center' }) => (
    <div className={`flex flex-col gap-2 ${align === 'center' ? 'items-center text-center' : ''}`}>
      <span className="text-white text-sm font-medium font-inter uppercase tracking-wider">
        {t('footer.contactUs', 'Contact Us')}
      </span>
      <a
        href="mailto:info@vidacure.se"
        className="inline-flex items-center gap-2 text-amber-200 hover:text-amber-100 text-base font-semibold font-inter transition-colors duration-200"
      >
        <Mail className="size-4" />
        info@vidacure.se
      </a>
    </div>
  );

  return (
    <footer className="bg-teal-800 text-white">
      {/* Logo - Desktop only, positioned absolutely */}
      <div className="hidden lg:block relative">
        <Link to={ROUTES.HOME} className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
          <img
            className="w-36 h-6"
            src={footer}
            alt="Vidacure Logo"
          />
        </Link>
      </div>

      <div className="px-5 py-8 lg:px-20 lg:pt-28 lg:pb-20">
        <div className="max-w-7xl mx-auto">

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="flex justify-between items-start mb-16">
              {footerSections.map((section, index) => (
                <div key={index} className="flex flex-col">
                  <div className="mb-5">
                    <h3 className="text-white text-sm font-medium font-inter uppercase leading-tight tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {section.links.map((link, linkIndex) => (
                      <FooterLink key={linkIndex} href={link.href} onClick={link.onClick}>
                        {link.name}
                      </FooterLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Bottom Section */}
            <div className="pt-16">
              <div className="pb-8 flex flex-col gap-3">
                <p className="text-emerald-50 text-base font-normal font-inter leading-relaxed">
                  {t('footer.legalCopyright')}
                </p>
                <p className="text-emerald-50 text-sm font-normal font-inter leading-relaxed max-w-5xl">
                  {t('footer.legalDisclaimer')}
                </p>
              </div>
              <div className="py-8 border-t border-emerald-50 flex justify-between items-center">
                <div className="flex flex-col gap-4">
                  <p className="text-emerald-50 text-base font-normal font-inter leading-relaxed">
                    {t('footer.copyright')}
                  </p>
                  <div className="flex gap-4">
                    {socialIcons.map((social, index) => (
                      <SocialIcon key={index} {...social} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <ContactBlock align="left" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="flex flex-col gap-16">
              {footerSections.map((section, index) => (
                <div key={index} className="flex flex-col">
                  <div className="mb-5">
                    <h3 className="text-white text-base font-bold font-manrope uppercase leading-snug">
                      {section.title}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {section.links.map((link, linkIndex) => (
                      <FooterLink key={linkIndex} href={link.href} onClick={link.onClick}>
                        {link.name}
                      </FooterLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Bottom Section */}
            <div className="mt-16">
              <div className="pb-8 flex flex-col gap-3 text-center">
                <p className="text-emerald-50 text-base font-normal font-inter leading-relaxed">
                  {t('footer.legalCopyright')}
                </p>
                <p className="text-emerald-50 text-sm font-normal font-inter leading-relaxed">
                  {t('footer.legalDisclaimer')}
                </p>
              </div>
              <div className="py-8 border-t border-emerald-50 flex flex-col items-center gap-8">
                <ContactBlock align="center" />
                <div className="flex flex-col items-center gap-4">
                  <p className="text-emerald-50 text-base font-normal font-inter leading-relaxed text-center">
                    {t('footer.copyright')}
                  </p>
                  <div className="flex gap-4">
                    {socialIcons.map((social, index) => (
                      <SocialIcon key={index} {...social} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;