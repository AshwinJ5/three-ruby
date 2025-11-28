"use client";

import React, { useRef, memo } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// --- 0. GLOBAL STYLES FOR 3D CUBE (Drop-in) ---
const GlobalStyles = () => (
    <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        
        @keyframes spin-3d {
            from { transform: rotateX(0deg) rotateY(0deg); }
            to   { transform: rotateX(360deg) rotateY(360deg); }
        }
        .animate-spin-3d {
            animation: spin-3d 20s linear infinite;
        }
    `}</style>
);

// --- 1. LOGO COMPONENT ---
const CubeLogo = memo(() => {
    const baseClass = "absolute w-[36px] h-[36px] bg-[#FFE4D6]";
    return (
        <div className="relative w-[140px] h-[92px] shrink-0" aria-label="Logo">
            <div className={`${baseClass} -top-1.5 left-1/2 -translate-x-1/2`} />
            <div className={`${baseClass} top-3 left-2 -rotate-45`} />
            <div className={`${baseClass} top-3 right-2 rotate-45`} />
            <div className={`${baseClass} bottom-0 -left-2.5`} />
            <div className={`${baseClass} bottom-0 left-1/2 -translate-x-1/2`} />
            <div className={`${baseClass} bottom-0 -right-2.5`} />
        </div>
    );
});
CubeLogo.displayName = "CubeLogo";

// --- 2. FLOATING CUBE COMPONENT ---
interface FloatingCubeProps {
    images: string[];
    alt?: string;
    className?: string;
}

const FloatingCube: React.FC<FloatingCubeProps> = ({ images, alt = "Cube Side", className = "" }) => {
    const getImg = (index: number) => images[index % images.length];

    return (
        <div
            className={`group relative z-10 perspective-1000 ${className} 
            w-32 h-32 
            md:absolute 
            md:w-32 md:h-32 
            lg:w-40 lg:h-40 
            [--s:128px] lg:[--s:160px]`}
        >
            <div className="relative h-full w-full preserve-3d animate-spin-3d group-hover:[animation-play-state:paused]">
                <CubeFace src={getImg(0)} alt={alt} transform="rotateY(0deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(1)} alt={alt} transform="rotateY(180deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(2)} alt={alt} transform="rotateY(90deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(3)} alt={alt} transform="rotateY(-90deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(4)} alt={alt} transform="rotateX(90deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(5)} alt={alt} transform="rotateX(-90deg) translateZ(calc(var(--s)/2))" />
            </div>
        </div>
    );
};

const CubeFace = ({ src, alt, transform }: { src: string; alt: string; transform: string }) => (
    <div
        className="absolute inset-0 h-full w-full bg-[#331D10] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-white/10 backface-hidden"
        style={{ transform }}
    >
        <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 128px, 160px"
            className="object-cover opacity-90 hover:opacity-100 transition-opacity"
        />
    </div>
);

// --- 3. MAIN LANDING PAGE ---
const LandingPage: React.FC = () => {
    // Framer Motion Hooks for the Pinned Section
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Adds a subtle rotation to the ring of cubes as you scroll down the 500vh
    const rotation = useTransform(scrollYProgress, [0, 1], [0, 45]);

    return (
        <div className="flex min-h-screen flex-col font-sans bg-[#331707] text-[#F2EBE3]">
            <GlobalStyles />

            {/* --- HERO SECTION --- */}
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pb-20">
                <header className="flex justify-center pb-16 pt-12">
                    <CubeLogo />
                </header>

                <section className="relative z-10 mx-auto mb-16 max-w-5xl px-4 text-center">
                    <h1 className="font-serif text-[40px] leading-tight md:text-[60px] md:leading-[1.15] font-normal">
                        The First Media Company crafted For the Digital First generation
                    </h1>
                </section>
                
            </div>

            {/* --- PINNED SCROLL SECTION (500VH) --- */}
            <section ref={containerRef} className="relative w-full h-[500vh]">
                
                {/* 
                   STICKY CONTAINER
                   This stays pinned to the screen while the parent scrolls.
                */}
                <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
                    
                    {/* 
                        Motion Div: Rotates slightly based on scroll progress 
                        to give depth feedback.
                    */}
                    <motion.div 
                        style={{ rotate: rotation }}
                        className="relative w-full max-w-6xl h-[750px] px-4"
                    >
                        
                        {/* CENTER TEXT (Counter-rotated so it stays straight) */}
                        <motion.div 
                            style={{ rotate: useTransform(rotation, r => -r) }}
                            className="relative z-20 mx-auto mb-12 max-w-md text-center md:absolute md:left-1/2 md:top-1/2 md:mb-0 md:-translate-x-1/2 md:-translate-y-1/2"
                        >
                            <h2 className="mb-4 text-[20px] font-bold uppercase tracking-widest">
                                Where innovation meets precision.
                            </h2>
                            <p className="px-6 text-[18px] leading-relaxed text-white/70 md:text-sm font-thin">
                                Symphonia unites visionary thinkers, creative architects, and analytical experts,
                                collaborating seamlessly to transform challenges into opportunities.
                            </p>
                        </motion.div>

                        {/* CUBES GRID */}
                        <div className="grid w-full grid-cols-2 gap-4 md:block h-full">
                            
                            {/* Top Row */}
                            <FloatingCube
                                images={["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg"]}
                                className="md:left-[15%] md:top-[10%]"
                            />
                            <FloatingCube
                                images={["/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg", "/img1.jpg"]}
                                className="md:right-[15%] md:top-[10%]"
                            />

                            {/* Middle Row */}
                            <FloatingCube
                                images={["/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg", "/img1.jpg", "/img2.jpg"]}
                                className="md:left-[2%] md:top-[38%]"
                            />
                            <FloatingCube
                                images={["/img4.jpg", "/img5.jpg", "/img6.jpg", "/img1.jpg", "/img2.jpg", "/img3.jpg"]}
                                className="md:right-[2%] md:top-[38%]"
                            />

                            {/* Bottom Row */}
                            <FloatingCube
                                images={["/img5.jpg", "/img6.jpg", "/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"]}
                                className="md:bottom-[13%] md:left-[15%]"
                            />
                            <FloatingCube
                                images={["/img6.jpg", "/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg"]}
                                className="md:bottom-[13%] md:right-[15%]"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- NEXT SECTION --- */}
            <div className="flex min-h-[50vh] grow items-center justify-center bg-[#CDB9AB] text-[#331D10] z-20 relative">
                <p className="text-sm font-medium tracking-wide">Your next section goes here.</p>
            </div>
        </div>
    );
};

export default LandingPage;