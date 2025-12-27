import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
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
        { name: t('footer.blogs'), href: '#education' },
        { name: t('footer.careers'), href: '#' } // TODO: Add careers page route when available
      ]
    },
    {
      title: t('footer.platform'),
      links: [
        { name: t('footer.forDoctors'), href: ROUTES.LOGIN },
        { name: t('footer.forPatients'), href: ROUTES.LOGIN }
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
        { name: t('footer.termsOfService'), href: '/terms' },
        { name: t('footer.cookiePolicy'), href: '/cookies' },
        { name: t('footer.cookieSettings', 'Cookie Settings'), href: '#cookie-settings', onClick: openPreferences }
      ]
    }
  ];

  const socialIcons = [
    { icon: Facebook, href: "https://facebook.com/vidacure", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/vidacure", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/vidacure", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/vidacure", label: "LinkedIn" }
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

  return (
    <footer className="bg-teal-800 text-white">
      {/* Logo - Desktop only, positioned absolutely */}
      <div className="hidden lg:block relative">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
          <img 
            className="w-36 h-6" 
            src={footer}
            alt="Vidacure Logo"
          />
        </div>
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
                  {/* {certifications.map((cert, index) => (
                    <img
                      key={index}
                      className={cert.className}
                      src={cert.src}
                      alt={cert.alt}
                    />
                  ))} */}
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
              <div className="py-8 border-t border-emerald-50 flex flex-col items-center gap-8">
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