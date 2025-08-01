import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bricolage_Grotesque } from "next/font/google";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faFacebookF,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

const Footer = ({ hiddenPage }) => {
  const pathname = usePathname();
  const authorPages =
    pathname.startsWith("/author") || pathname.startsWith("/dashboard");

  return (
    <footer className={`bg-[#000000] w-full hidden`}>
      <section className="bg-[#000000] w-full max-w-7xl mx-auto px-4 pt-8 pb-0 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8">
          {/* Logo & Socials */}
          <div className="flex flex-col sm:flex-row sm:items-center items-center gap-4 sm:gap-6">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="ITAN Logo"
                width={140}
                height={56}
                className="w-auto h-16 md:h-18 lg:h-24 xl:h-32"
                priority
                sizes="140px"
              />
            </Link>
            <div className="flex items-center text-gray-200">
              <div className="flex space-x-2">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon
                    icon={faLinkedinIn}
                    className="w-[15px] h-5 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353]"
                  />
                </Link>
                <Link
                  href="https://x.com/ItanGlobal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    className="w-[15px] h-5 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353]"
                  />
                </Link>
                <Link
                  href="https://web.facebook.com/itanglobalpublishing/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faFacebookF}
                    className="w-[15px] h-5 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353]"
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
            {/* Mobile links */}
            <div className="flex flex-col items-center sm:hidden mt-3 text-[13px] text-gray-400 gap-2">
              <Link
                href="https://itanglobalpublishing.substack.com/"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Author Resources
              </Link>
              <Link
                href="mailto:support@itan.app"
                target="_blank"
                aria-label="Contact support via email"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Help Center
              </Link>
              <Link
                href="https://www.youtube.com/@itanIGP"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Youtube
              </Link>
              <Link
                href="https://itanglobalpublishing.substack.com/"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Blog
              </Link>
              <Link
                href="#"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Contact
              </Link>
              <Link
                href="#"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Content Policy
              </Link>
              <Link
                href="/terms&conditions"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/privacy-policies"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Privacy &amp; Policy
              </Link>
            </div>
          </div>
          {/* Desktop links */}
          <div className="hidden sm:grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] text-gray-400 min-w-[250px]">
            <Link
              href="https://itanglobalpublishing.substack.com/"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Author Resources
            </Link>
            <Link
              href="https://itanglobalpublishing.substack.com/"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Blog
            </Link>
            <Link
              href="mailto:support@itan.app"
              target="_blank"
              aria-label="Contact support via email"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Help Center
            </Link>
            <Link
              href="#"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Content Policy
            </Link>
            <Link
              href="https://www.youtube.com/@itanIGP"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Youtube
            </Link>
            <Link
              href="#"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Separator with terms & conditions and privacy & policy links overlayed, responsive */}
        <div className="relative w-full flex items-center justify-center my-2">
          <span className="block h-[2px] w-full bg-[#EF5353]/30 absolute left-0 top-1/2 -translate-y-1/2 z-0"></span>
          <div className="relative z-10 px-2 sm:px-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-gray-200 text-xs sm:text-sm font-light max-w-full">
            <Link
              href="/terms&conditions"
              className="cursor-pointer text-[#FFFFFF] whitespace-nowrap"
            >
              Terms &amp; Conditions
            </Link>
            <span className="text-[#FFFFFF]">|</span>
            <Link
              href="/privacy-policies"
              className="cursor-pointer text-[#FFFFFF] whitespace-nowrap"
            >
              Privacy &amp; Policy
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-gray-200 flex justify-center w-full pb-4 text-xs sm:text-sm md:text-base">
          <p style={{ fontFamily: "Lato, sans-serif" }}>
            ITAN Technologies Ltd. &copy; 2025. All Rights Reserved
          </p>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
