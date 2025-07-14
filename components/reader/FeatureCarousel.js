"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "📱",
    title: "Enjoy on all your devices",
    description:
      "Books that travel with you – Enjoy reading on all your devices",
    gradient: "from-[#232526] via-[#393939] to-[#181818]", // Netflix subtle dark gradient
  },
  {
    icon: "🌍",
    title: "One Place. Infinite Stories. All Ages.",
    description:
      "From picture books to handpicked reads for teens, to adult page turners, we’ve got stories for every age and stage.",
    gradient: "from-[#181818] via-[#232526] to-[#393939]", // Netflix subtle dark gradient
  },
  {
    icon: "🧒",
    title: "Give your kids access to endless books and adventures",
    description:
      "Spark curiosity with enchanting tales and first reads made to grow with your child.",
    gradient: "from-[#232526] via-[#181818] to-[#393939]", // Netflix subtle dark gradient
  },
  {
    icon: "⭐",
    title: "Curate your favorites",
    description:
      "Organize and revisit books you love with your personalized library.",
    gradient: "from-[#181818] via-[#393939] to-[#232526]", // Netflix subtle dark gradient
  },
];

export default function FeatureCarousel() {
  return (
    <section className="bg-black py-16 px-4 text-white">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-12 tracking-tight">
        Stories for Everyone, <span className="text-red-600">Everywhere</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 xl:gap-12 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: idx * 0.12,
              type: "spring",
              stiffness: 60,
              damping: 18,
            }}
            className={`w-full max-w-[400px] mx-auto bg-gradient-to-br ${feature.gradient} p-8 rounded-2xl shadow-2xl flex flex-col justify-between border border-red-600/30 hover:scale-[1.04] hover:shadow-red-400/40 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
            style={{ minHeight: 240 }}
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl md:text-4xl mr-3 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </span>
              <h4 className="text-xl md:text-2xl font-semibold drop-shadow-sm tracking-tight">
                {feature.title}
              </h4>
          
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-6 rounded-xl shadow-lg h-[200px] w-[300px]">
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm">{feature.description}</p>
            </div>
            <p className="text-base md:text-lg opacity-95 leading-relaxed font-medium tracking-tight">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
