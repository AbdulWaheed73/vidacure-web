import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/Button";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Logo from "../../assets/vidacure_png.png";
import { darkTealText, ROUTES } from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userName = useAuthStore((s) => s.user?.name);

  const getInitials = (name: string | undefined) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const scrollToSection = (sectionId: string) => {
    const isHomePage = location.pathname === '/' || location.pathname === ROUTES.HOME;

    if (isHomePage) {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to home page with hash
      navigate(`${ROUTES.HOME}#${sectionId}`);
    }
    setIsOpen(false); // Close mobile menu after clicking
  };

  return (
    <>
      {/* Mobile menu backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <header className="w-full border-b bg-white relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="inline-block">
              <img
                src={Logo}
                alt="VIDACURE"
                className="h-4 w-auto sm:h-5 flex-shrink-0"
              />
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex" viewport={false}>
              <NavigationMenuList className="flex items-center space-x-0.5 xl:space-x-2">
                <NavigationMenuItem>
                  <a
                    href="#the-treatment"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("the-treatment");
                    }}
                    className={`${darkTealText} font-normal inline-flex items-center justify-center px-2 xl:px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm whitespace-nowrap`}
                  >
                    {t("navbar.howItWorks")}
                  </a>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to={ROUTES.ABOUT_US}
                    className={`${darkTealText} font-normal inline-flex items-center justify-center px-2 xl:px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm whitespace-nowrap`}
                  >
                    {t("navbar.ourStory")}
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`${darkTealText} font-normal bg-transparent hover:bg-transparent text-sm px-2 xl:px-4`}>
                    {t("navbar.education")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="#education"
                            className="block w-full select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection("education");
                            }}
                          >
                            <div className="text-sm font-medium leading-none">
                              {t("navbar.educationSubmenu.articles")}
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="#understanding-obesity"
                            className="block w-full select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection("understanding-obesity");
                            }}
                          >
                            <div className="text-sm font-medium leading-none">
                              {t("navbar.educationSubmenu.aboutObesity")}
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="#education"
                            className="block w-full select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection("education");
                            }}
                          >
                            <div className="text-sm font-medium leading-none">
                              {t("navbar.educationSubmenu.nutrition")}
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="#education"
                            className="block w-full select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection("education");
                            }}
                          >
                            <div className="text-sm font-medium leading-none">
                              {t("navbar.educationSubmenu.workout")}
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("pricing");
                    }}
                    className={`${darkTealText} font-normal inline-flex items-center justify-center px-2 xl:px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm whitespace-nowrap`}
                  >
                    {t("navbar.pricing")}
                  </a>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("faq");
                    }}
                    className={`${darkTealText} font-normal inline-flex items-center justify-center px-2 xl:px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm whitespace-nowrap`}
                  >
                    {t("navbar.faq")}
                  </a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-shrink-0">
              <LanguageToggle />
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="h-10 px-4 xl:px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 self-start hover:from-teal-700 hover:to-teal-700 transition-colors"
                >
                  <span className="text-white text-sm font-semibold font-['Sora'] leading-tight whitespace-nowrap">
                    {t("navbar.dashboard")}
                  </span>
                  <Avatar className="h-7 w-7 border-2 border-white/30">
                    <AvatarFallback className="bg-white/20 text-white text-xs font-sora font-bold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <>
                  <Link
                    to={ROUTES.PRE_LOGIN_BMI}
                    className={`${darkTealText} font-normal inline-flex items-center justify-center px-2 xl:px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm whitespace-nowrap`}
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    to={ROUTES.PRE_LOGIN_BMI}
                    className="h-10 px-4 xl:px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 self-start hover:from-teal-700 hover:to-teal-700 transition-colors"
                  >
                    <span className="text-white text-sm font-semibold font-['Sora'] leading-tight whitespace-nowrap">
                      {t("navbar.getStarted")}
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="lg:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 border-t bg-white w-full shadow-lg">
              <NavigationMenu className="min-w-full">
                <NavigationMenuList className="flex flex-col min-w-full">
                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink asChild>
                      <a
                        href="#the-treatment"
                        className="block w-full justify-center text-teal-700 hover:text-teal-900 py-3 px-4 text-center"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection("the-treatment");
                        }}
                      >
                        {t("navbar.howItWorks")}
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink asChild>
                      <Link
                        to={ROUTES.ABOUT_US}
                        className="block w-full justify-center text-teal-700 hover:text-teal-900 py-3 px-4 text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        {t("navbar.ourStory")}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink asChild>
                      <a
                        href="#education"
                        className="block w-full justify-center text-teal-700 hover:text-teal-900 py-3 px-4 text-center"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection("education");
                        }}
                      >
                        {t("navbar.education")}
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink asChild>
                      <a
                        href="#pricing"
                        className="block w-full justify-center text-teal-700 hover:text-teal-900 py-3 px-4 text-center"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection("pricing");
                        }}
                      >
                        {t("navbar.pricing")}
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink asChild>
                      <a
                        href="#faq"
                        className="block w-full justify-center text-teal-700 hover:text-teal-900 py-3 px-4 text-center"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection("faq");
                        }}
                      >
                        {t("navbar.faq")}
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <div className="flex flex-col space-y-3 pt-4 border-t min-w-full">
                    <LanguageToggle />
                    <div className="flex flex-col space-y-4 w-full">
                      {isAuthenticated ? (
                        <Link
                          to="/dashboard"
                          className="w-full h-10 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 hover:from-teal-700 hover:to-teal-700 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
                            {t("navbar.dashboard")}
                          </span>
                          <Avatar className="h-6 w-6 border-2 border-white/30">
                            <AvatarFallback className="bg-white/20 text-white text-[10px] font-sora font-bold">
                              {getInitials(userName)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                      ) : (
                        <>
                          <Link
                            to={ROUTES.PRE_LOGIN_BMI}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 rounded-full text-gray-800 py-2.5 px-4 inline-flex items-center justify-center"
                            onClick={() => setIsOpen(false)}
                          >
                            {t("navbar.login")}
                          </Link>
                          <Link
                            to={ROUTES.PRE_LOGIN_BMI}
                            className="w-full h-10 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 hover:from-teal-700 hover:to-teal-700 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
                              {t("navbar.getStarted")}
                            </span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
