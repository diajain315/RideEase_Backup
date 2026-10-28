import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faMapLocationDot, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const attractions = [
  {
    name: "Fatehsagar Lake",
    image: "/images/fatehsagarlake.jpg",
    description: "A serene lake famous for vibrant sunsets, lakeside cafes, and peaceful speedboat cruises.",
    link: "https://en.wikipedia.org/wiki/Fateh_Sagar_Lake",
  },
  {
    name: "City Palace",
    image: "/images/cp.jpg",
    description: "A grand palace complex perched over Lake Pichola, showcasing centuries of royal Mewar heritage.",
    link: "https://en.wikipedia.org/wiki/City_Palace,_Udaipur",
  },
  {
    name: "Sajjangarh Fort",
    image: "/images/sajjan.jpg",
    description: "Also known as the Monsoon Palace, situated atop a hill offering panoramic sunset vistas.",
    link: "https://en.wikipedia.org/wiki/Sajjangarh",
  },
  {
    name: "Lake Pichola",
    image: "/images/lakep.jpeg",
    description: "The historical heart of Udaipur with picturesque ghats, island palaces, and boat cruises.",
    link: "https://en.wikipedia.org/wiki/Lake_Pichola",
  },
  {
    name: "Jagdish Temple",
    image: "/images/jt.jpg",
    description: "A 1651 AD Indo-Aryan temple dedicated to Lord Vishnu, embellished with intricate stone carvings.",
    link: "https://en.wikipedia.org/wiki/Jagdish_Temple",
  },
  {
    name: "Saheliyon Ki Bari",
    image: "/images/sb.jpeg",
    description: "Historic botanical retreat featuring fountains, marble elephants, and landscaped gardens.",
    link: "https://en.wikipedia.org/wiki/Saheliyon-ki-Bari",
  },
  {
    name: "Jag Mandir",
    image: "/images/jm.jpeg",
    description: "A regal marble island palace surrounded by shimmering water and historic gardens.",
    link: "https://en.wikipedia.org/wiki/Jag_Mandir",
  },
  {
    name: "Bagore Ki Haveli",
    image: "/images/bh.jpeg",
    description: "Lakeside haveli famous for traditional puppet theater, folk dances, and cultural exhibits.",
    link: "https://en.wikipedia.org/wiki/Bagore-ki-Haveli",
  },
];

const Attractions = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className={`text-center max-w-3xl mx-auto mb-12 transform transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-3">
            <FontAwesomeIcon icon={faLocationDot} className="text-emerald-500" />
            Explore the City of Lakes
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Popular Destinations by Bike
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Rent your bike and effortlessly explore the best scenic spots, forts, and lakes in and around Udaipur.
          </p>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {attractions.map((place, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group ${
                animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-[11px] font-semibold text-white">
                  Must Visit
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {place.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={place.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <span>Read History</span>
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                  </a>
                  <span className="text-[11px] text-slate-400 font-medium">Udaipur</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faMapLocationDot} className="text-emerald-500" />
              Interactive City Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Navigate seamlessly between rental pickup points and top sightseeing spots.
            </p>
          </div>
          
          <div className="w-full h-96 rounded-2xl overflow-hidden border border-slate-200">
            <iframe
              title="Udaipur Tourist Map"
              className="w-full h-full border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.521134731287!2d73.67711637493562!3d24.57127075716095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e5bff1df48c9%3A0x9910c2fcb172b20f!2sUdaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1712101234567"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attractions;
