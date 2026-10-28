import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faBiking,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const footerLinks = [
    {
      heading: "Explore Udaipur",
      links: [
        {
          name: "Fatehsagar Lake",
          href: "https://en.wikipedia.org/wiki/Fateh_Sagar_Lake",
          icon: faMapMarkerAlt,
        },
        {
          name: "City Palace",
          href: "https://en.wikipedia.org/wiki/City_Palace,_Udaipur",
          icon: faMapMarkerAlt,
        },
        {
          name: "Ambrai Ghat",
          href: "https://en.wikipedia.org/wiki/Ambrai_Ghat",
          icon: faMapMarkerAlt,
        },
        {
          name: "Sajjangarh Monsoon Palace",
          href: "https://en.wikipedia.org/wiki/Monsoon_Palace",
          icon: faMapMarkerAlt,
        },
      ],
    },
    {
      heading: "Quick Links",
      links: [
        { name: "Home", href: "/", icon: faBiking },
        { name: "Our Fleet", href: "/bikerentsection", icon: faBiking },
        { name: "Testimonials", href: "/reviews", icon: faBiking },
        { name: "Contact Us", href: "/contact", icon: faBiking },
      ],
    },
    {
      heading: "Contact & Location",
      links: [
        { name: "+91 98292 44434", href: "tel:+919829244434", icon: faPhone },
        { name: "+91 93345 62344", href: "tel:+919334562344", icon: faPhone },
        {
          name: "bikerent29@gmail.com",
          href: "mailto:bikerent29@gmail.com",
          icon: faEnvelope,
        },
        { name: "Udaipur, Rajasthan, India", icon: faMapMarkerAlt },
      ],
    },
  ];

  const socialLinks = [
    { icon: faFacebookF, href: "#", name: "Facebook" },
    { icon: faTwitter, href: "#", name: "Twitter" },
    { icon: faInstagram, href: "#", name: "Instagram" },
    { icon: faLinkedinIn, href: "#", name: "LinkedIn" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="container mx-auto px-4 py-14 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center transition-transform hover:scale-105">
              <img
                className="h-8 sm:h-9 w-auto object-contain"
                src="/images/BikeForRentFinalLogo-white.png"
                alt="RideEase Logo"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience the freedom of two-wheeled exploration with premium bikes and scooters in the City of Lakes, Udaipur.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-850 transition-all border border-slate-800"
                >
                  <FontAwesomeIcon icon={social.icon} size="sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                {section.heading}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href ? (
                      link.href.startsWith("http") ||
                      link.href.startsWith("tel:") ||
                      link.href.startsWith("mailto:") ? (
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={link.icon}
                            className="text-xs text-emerald-500/70"
                          />
                          <span>{link.name}</span>
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={link.icon}
                            className="text-xs text-emerald-500/70"
                          />
                          <span>{link.name}</span>
                        </Link>
                      )
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400">
                        <FontAwesomeIcon
                          icon={link.icon}
                          className="text-xs text-emerald-500/70"
                        />
                        <span>{link.name}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} RideEase Rentals. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/termsc" className="hover:text-emerald-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/faqs" className="hover:text-emerald-400 transition-colors">
              FAQs
            </Link>
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
