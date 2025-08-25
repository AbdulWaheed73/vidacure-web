import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

import Logo from "../../assets/vidacure_png.png";
import { darkTealText } from "@/constants";
import { LoginPage } from "@/pages";
import { Navigate } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <img
              src={Logo}
              alt="VIDACURE"
              className="h-4 w-auto sm:h-5 flex-shrink-0"
            />

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="flex items-center space-x-2">
                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    className={`${darkTealText} font-normal`}
                  >
                    How it works
                  </Button>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    className={`${darkTealText} font-normal`}
                  >
                    Our Story
                  </Button>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    className={`${darkTealText} font-normal`}
                  >
                    Understanding Obesity
                  </Button>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    className={`${darkTealText} font-normal`}
                  >
                    Insights & Tips
                  </Button>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Button variant="ghost">
                    <div className={darkTealText}>Pricing</div>
                  </Button>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Button
                    variant={"ghost"}
                    className={`${darkTealText} font-normal`}
                  >
                    FAQ
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Auth Buttons */}
            <div
              className="hidden lg:flex items-center space-x-4 flex-shrink-0"
              onClick={() => (
                <>
                  <LoginPage
                    onLogin={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    loading={false}
                  />
                </>
              )}
            >
              <Button variant="ghost" className={`text-dark-teal font-normal`}>
                Login
              </Button>
              <button className="h-10 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 self-start hover:from-teal-700 hover:to-teal-700 transition-colors">
                <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
                  Get Started
                </span>
              </button>
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
          {isOpen && (
            <div className="lg:hidden py-4 border-t">
              <NavigationMenu className="w-full">
                <NavigationMenuList className="flex flex-col space-y-2 w-full">
                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink className="block w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-teal-700 hover:text-teal-900"
                      >
                        How it works
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink className="block w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-teal-700 hover:text-teal-900"
                      >
                        Our Story
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink className="block w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-teal-700 hover:text-teal-900"
                      >
                        Understanding Obesity
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink className="block w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-teal-700 hover:text-teal-900"
                      >
                        Insights & Tips
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink className="block w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-teal-700 hover:text-teal-900"
                      >
                        Pricing
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink className="block w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-teal-700 hover:text-teal-900"
                      >
                        FAQ
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <div className="flex flex-row space-y-2 pt-4 border-t">
                    <Button
                      variant="ghost"
                      className="bg-teal-500 hover:bg-teal-600 rounded-full justify-evenly"
                    >
                      Login 2
                    </Button>
                    <button
                      className="h-10 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 self-start hover:from-teal-700 hover:to-teal-700 transition-colors"
                      onClick={() => {
                        Navigate({ to: "/login" });
                      }}
                    >
                      <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
                        Get Started 2
                      </span>
                    </button>
                  </div>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
