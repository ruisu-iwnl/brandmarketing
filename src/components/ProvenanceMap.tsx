"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

const regions = [
  {
    id: "palawan",
    name: "Palawan",
    coordinates: { top: "62%", left: "30%" },
    material: "South Sea Pearls",
    description: "Sourced from the pristine waters of the Sulu Sea, these pearls are known for their golden luster and timeless elegance.",
  },
  {
    id: "cebu",
    name: "Cebu",
    coordinates: { top: "66%", left: "68%" },
    material: "Hand-Woven Beads",
    description: "Carefully selected handpicked beads sourced from the Visayas, reflecting the vibrant colors of our island culture.",
  },
  {
    id: "cabanatuan",
    name: "Cabanatuan City",
    coordinates: { top: "33%", left: "45%" },
    material: "The Artisan's Workshop",
    description: "The heart of Joulery. Every single piece is meticulously handcrafted here by our lone artisan, weaving Philippine creativity into wearable art.",
  },
];

export default function ProvenanceMap() {
  const [hoveredRegion, setHoveredRegion] = useState<typeof regions[0] | null>(null);

  return (
    <section className="py-0 px-8 bg-pink-calm overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="relative w-full md:w-1/2 flex justify-center items-center py-12">
          <div className="relative w-full max-w-[300px]">
            <Image
              src="/map.svg"
              alt="Map of the Philippines"
              width={400}
              height={500}
              className="w-full h-auto drop-shadow-md"
            />

            {regions.map((region) => (
              <div
                key={region.id}
                className="absolute cursor-pointer group -translate-x-1/2 -translate-y-1/2"
                style={{ top: region.coordinates.top, left: region.coordinates.left }}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <motion.div
                  animate={{ scale: hoveredRegion?.id === region.id ? 1.3 : 1 }}
                  className="p-2 bg-foreground rounded-full text-white-calm shadow-lg"
                >
                  <MapPin size={16} />
                </motion.div>

                <div className="absolute top-0 left-full ml-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-white-calm px-3 py-1 text-xs uppercase tracking-widest shadow-sm pointer-events-none z-10">
                  {region.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center min-h-[400px]">
          <h2 className="text-xs uppercase tracking-[0.2em] mb-6 text-pink-accent">Provenance</h2>
          <h3 className="text-4xl font-light mb-8 text-foreground">Sourced with Purpose</h3>

          <AnimatePresence mode="wait">
            {hoveredRegion ? (
              <motion.div
                key={hoveredRegion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-xl font-medium mb-2 text-foreground">{hoveredRegion.material}</h4>
                <p className="text-sm uppercase tracking-widest text-pink-accent mb-6">{hoveredRegion.name}</p>
                <p className="text-lg font-light leading-relaxed text-foreground/80">
                  {hoveredRegion.description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-lg font-light italic text-foreground/50"
              >
                Hover over a region on the map to discover the origin of our materials.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
