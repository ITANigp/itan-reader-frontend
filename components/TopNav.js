"use client";
import React, { useState, useEffect } from "react";
import LandingPgBtn from "./LandingPgBtn";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faFacebookF,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { usePathname } from "next/navigation";
import {
  faBars,
  faTimes,
  faInfoCircle,
  faBookOpen,
  faDollarSign,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";

library.add(
  faBars,
  faTimes,
  faInfoCircle,
  faBookOpen,
  faDollarSign,
  faQuestionCircle
);

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

const TopNav = ({ styles }) => {
  const [menu, setMenu] = useState(false);
  const [showCloseIcon, setShowCloseIcon] = useState(false);

  const toggleMenu = () => {
    if (!menu) {
      setMenu(true);
      setTimeout(() => setShowCloseIcon(true), 150);
    } else {
      setShowCloseIcon(false);
      setTimeout(() => setMenu(false), 50);
    }
  };

  useEffect(() => {
    if (menu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menu]);

  const menuItems = [
    { title: "About Itan", href: "/", icon: faInfoCircle },
    { title: "Publish", href: "/publish", icon: faBookOpen },
    { title: "Monetize", href: "/monetize", icon: faDollarSign },
    { title: "The Griot Review", href: "/TheGroitReview", icon: faBookOpen },
    { title: "Help", href: "/help", icon: faQuestionCircle },
  ];

  const pathname = usePathname();
  const homePath = pathname.endsWith("/");
  const publishPath = pathname.endsWith("/publish");
  const monetizePath = pathname.endsWith("/monetize");
  const blogPath = pathname.endsWith("/TheGroitReview");
  const helpPath = pathname.endsWith("/help");

  return (
    <nav
      className={`${styles} h-16 w-full bg-[#111928] px-5 flex items-center fixed top-0 z-50`}
    >
      {/* Mobile Menu Button - Left Side */}
      <div className="flex items-center md:hidden [@media(min-width:768px)_and_(max-width:1000px)]:flex">
        <button
          className="z-30 px-2"
          onClick={toggleMenu}
          aria-label={menu ? "Close menu" : "Open menu"}
        >
          <FontAwesomeIcon
            icon={showCloseIcon ? faTimes : faBars}
            style={{ color: "#FFFFFF" }}
            className="text-[21px]"
          />
        </button>
      </div>

      {/* Mobile Logo - Far Right (only on small screens) */}
      <div className="flex items-center ml-auto md:hidden">
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={50}
            height={12}
            alt="itan logo"
            // CHANGED: Added custom media query to hide logo between 630px-770px
            className="w-10 block [@media(min-width:630px)]:hidden [@media(min-width:770px)]:block"
          />
        </Link>
      </div>

      {/* Desktop/Tablet Logo and Text - Left Side (hidden on mobile) */}
      <div className="hidden md:flex items-center [@media(min-width:768px)_and_(max-width:1000px)]:hidden">
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={50}
            height={12}
            alt="itan logo"
            // CHANGED: Added custom media query to hide logo between 630px-770px
            className="w-10 md:w-12 [@media(min-width:630px)_and_(max-width:770px)]:hidden"
          />
        </Link>
        <p
          // CHANGED: Added custom media query to hide text between 630px-770px
          className={`${bricolage.className} hidden sm:flex text-gray-200 ml-2 font-medium items-baseline [@media(min-width:630px)_and_(max-width:770px)]:hidden`}
          style={{
            fontStretch: "condensed",
            fontVariationSettings: '"wdth" 75',
          }}
        >
          <span className="text-3xl md:text-4xl" style={{ fontSize: "22pt" }}>
            G
          </span>
          <span className="text-sm md:text-base" style={{ fontSize: "16pt" }}>
            lobal
          </span>
          <span className="mx-1"></span>
          <span className="text-3xl md:text-4xl" style={{ fontSize: "22pt" }}>
            P
          </span>
          <span className="text-sm md:text-base" style={{ fontSize: "16pt" }}>
            ublishing
          </span>
        </p>
      </div>

      {/* Desktop Navigation Links - Centered */}
      <div className="hidden lg:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
        <Link
          href="/"
          className={`${homePath ? "border-b-2 border-b-red-600" : ""} hover:border-b-2 hover:border-b-red-600 hover:text-red-400 cursor-pointer px-3 py-2 transition-all duration-200 text-sm font-medium text-gray-200`}
        >
          About Itan
        </Link>
        <Link
          href="/publish"
          className={`${publishPath ? "border-b-2 border-b-red-600" : ""} hover:border-b-2 hover:border-b-red-600 hover:text-red-400 cursor-pointer px-3 py-2 transition-all duration-200 text-sm font-medium text-gray-200`}
        >
          Publish
        </Link>
        <Link
          href="/monetize"
          className={`${monetizePath ? "border-b-2 border-b-red-600" : ""} hover:border-b-2 hover:border-b-red-600 hover:text-red-400 cursor-pointer px-3 py-2 transition-all duration-200 text-sm font-medium text-gray-200`}
        >
          Monetize
        </Link>
        <Link
          href="/TheGroitReview"
          className={`${blogPath ? "border-b-2 border-b-red-600" : ""} hover:border-b-2 hover:border-b-red-600 hover:text-red-400 cursor-pointer px-3 py-2 transition-all duration-200 text-sm font-medium text-gray-200`}
        >
          The Griot Review
        </Link>
        <Link
          href="/help"
          className={`${helpPath ? "border-b-2 border-b-red-600" : ""} hover:border-b-2 hover:border-b-red-600 hover:text-red-400 cursor-pointer px-3 py-2 transition-all duration-200 text-sm font-medium text-gray-200`}
        >
          Help
        </Link>
      </div>

      {/* Sign Up Button - Right Side (hidden on mobile) */}
      <div className="hidden sm:flex ml-auto">
        <Link
          href="/author/sign_up"
          className="bg-[#D4A853] text-white px-5 py-2 rounded-md hover:bg-[#C49A48] transition-colors text-sm font-medium"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menu && (
          <>
            <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-gray-900 shadow-xl z-30 flex flex-col py-20 px-6">
              <button
                className="absolute top-4 right-4 text-gray-200 p-2"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-2xl hover:text-red-400 transition-colors"
                />
              </button>

              <div className="mb-8">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={40}
                  height={32}
                  priority={true}
                  className="w-16 h-auto -mt-[60px] -ml-2"
                />
              </div>

              <nav className="flex flex-col space-y-6">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <Link
                      href={item.href}
                      className="text-gray-200 text-xl font-medium hover:text-red-400 transition-colors flex items-center gap-3"
                      onClick={toggleMenu}
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}
              </nav>

              <div className="my-10">
                <Link href="/author/sign_up">
                  <LandingPgBtn
                    variant="filled"
                    className="w-full py-3 text-base font-medium transition-all duration-300 hover:bg-red-600 active:scale-98"
                    onClick={toggleMenu}
                  >
                    Create Account
                  </LandingPgBtn>
                </Link>
              </div>

              <div className="flex items-center justify-start w-full text-white">
                <div className="flex space-x-2">
                  <Link href="#" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon
                      icon={faLinkedinIn}
                      className="w-[15px] h-5 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353] transition-colors"
                    />
                  </Link>
                  <Link
                    href="https://x.com/ItanGlobal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faXTwitter}
                      className="w-[15px] h-5 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353] transition-colors"
                    />
                  </Link>
                  <Link
                    href="https://web.facebook.com/itanglobalpublishing/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faFacebookF}
                      className="w-[15px] h-5 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353] transition-colors"
                    />
                  </Link>
                  <Link
                    href="https://www.instagram.com/itanglobalpublishing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="w-[15px] h-3 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353] hover:scale-110 transition-all duration-300"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default TopNav;
