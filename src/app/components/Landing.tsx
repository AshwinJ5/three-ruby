"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const GlobalStyles = () => (
    <style jsx global>{`
        .perspective-1000 {
            perspective: 1000px;
        }
        .preserve-3d {
            transform-style: preserve-3d;
        }
        .backface-hidden {
            backface-visibility: hidden;
        }
    `}</style>
);

interface FloatingCubeProps {
    images: string[];
    alt?: string;
    className?: string;
    style?: any;
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    individualRotateY?: MotionValue<number>;
    rotateZ?: MotionValue<number>;
}

const FloatingCube: React.FC<FloatingCubeProps> = ({
    images,
    alt = "Cube Side",
    className = "",
    style,
    rotateX,
    rotateY,
    individualRotateY,
    rotateZ,
}) => {
    const getImg = (index: number) => images[index % images.length];

    return (
        <motion.div
            style={style}
            className={`group absolute z-10 perspective-1000 
            w-32 h-32 lg:w-40 lg:h-40 
            [--s:128px] lg:[--s:160px] ${className}`}
        >
            <motion.div
                style={{
                    rotateX: rotateX,
                    rotateY: individualRotateY ? individualRotateY : rotateY,
                    rotateZ: rotateZ || 0,
                }}
                className="relative h-full w-full preserve-3d"
            >
                <CubeFace src={getImg(0)} alt={alt} transform="rotateY(0deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(1)} alt={alt} transform="rotateY(180deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(2)} alt={alt} transform="rotateY(90deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(3)} alt={alt} transform="rotateY(-90deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(4)} alt={alt} transform="rotateX(90deg) translateZ(calc(var(--s)/2))" />
                <CubeFace src={getImg(5)} alt={alt} transform="rotateX(-90deg) translateZ(calc(var(--s)/2))" />
            </motion.div>
        </motion.div>
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

const useCubePath = (
    scrollY: MotionValue<number>,
    start: { x: number; y: number; scale: number; opacity: number; rotation: number },
    end: { x: number; y: number; scale: number; opacity: number; rotation: number }
) => {
    const PHASE1_END = 0.33;

    const x = useTransform(scrollY, [0, PHASE1_END], [start.x, end.x]);

    const y = useTransform(scrollY, [0, PHASE1_END], [start.y, end.y]);

    const scale = useTransform(scrollY, [0, PHASE1_END], [start.scale, end.scale]);
    const opacity = useTransform(scrollY, [0, PHASE1_END], [start.opacity, end.opacity]);
    const rotation = useTransform(scrollY, [0, PHASE1_END], [start.rotation, end.rotation]);

    return { x, y, scale, opacity, rotation };
};

const LandingPage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const PHASE1_END = 0.33;
    const PHASE2_END = 0.67;

    const textBlur = useTransform(scrollYProgress, [0, 0.15, 0.25], ["blur(0px)", "blur(0px)", "blur(20px)"]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
    const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.3]);

    const centerTextOpacity = useTransform(scrollYProgress, [PHASE1_END - 0.05, PHASE1_END], [0, 1]);

    const cubeRotateX = useTransform(scrollYProgress, [0, PHASE1_END, PHASE2_END], [0, 180, 360]);

    const cubeRotateY = useTransform(scrollYProgress, [0, PHASE1_END, PHASE2_END], [0, 180, 360]);

    const individualRotateY = useTransform(scrollYProgress, [PHASE2_END, 1], [0, 90]);


    const cube1 = useCubePath(
        scrollYProgress,
        { x: 65, y: -45, scale: 0.3, opacity: 1, rotation: 45 },
        { x: -300, y: -100, scale: 1, opacity: 1, rotation: 0 }
    );

    const cube2 = useCubePath(
        scrollYProgress,
        { x: -65, y: -45, scale: 0.3, opacity: 1, rotation: 45 },
        { x: -300, y: 400, scale: 1, opacity: 1, rotation: 0 }
    );

    const cube3 = useCubePath(
        scrollYProgress,
        { x: 0, y: 20, scale: 0.3, opacity: 1, rotation: 0 },
        { x: 300, y: -100, scale: 1, opacity: 1, rotation: 0 } 
    );

    const cube4 = useCubePath(
        scrollYProgress,
        { x: -90, y: 20, scale: 0.3, opacity: 1, rotation: 0 },
        { x: -500, y: 150, scale: 1, opacity: 1, rotation: 0 } 
    );

    const cube5 = useCubePath(
        scrollYProgress,
        { x: 0, y: -70, scale: 0.3, opacity: 1, rotation: 0 },
        { x: 300, y: 400, scale: 1, opacity: 1, rotation: 0 } 
    );

    const cube6 = useCubePath(
        scrollYProgress,
        { x: 90, y: 20, scale: 0.3, opacity: 1, rotation: 0 },
        { x: 500, y: 150, scale: 1, opacity: 1, rotation: 0 } 
    );

    return (
        <div className="flex min-h-screen flex-col font-sans bg-[#331707] text-[#F2EBE3]">
            <GlobalStyles />

            <section ref={containerRef} className="relative w-full h-[600vh]">
                <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
                    <motion.div
                        style={{ filter: textBlur, opacity: textOpacity, scale: textScale }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-4"
                    >
                        <section className="max-w-5xl text-center">
                            <h1 className="font-serif text-[40px] leading-tight md:text-[60px] md:leading-[1.15] font-normal">
                                The first media company crafted
                                <br />
                                for the digital first generation.
                            </h1>
                        </section>
                    </motion.div>

                    <motion.div
                        style={{ opacity: centerTextOpacity }}
                        className="relative z-10 mx-auto max-w-2xl text-center px-6"
                    >
                        <h2 className="mb-6 text-[24px] font-bold uppercase tracking-widest">
                            Where innovation meets precision.
                        </h2>
                        <p className="text-[18px] leading-relaxed text-white/80 md:text-lg font-light max-w-3xl mx-auto">
                            Symphonia unites visionary thinkers, creative architects, and analytical experts, collaborating
                            seamlessly to transform challenges into opportunities. Together, we deliver tailored solutions
                            that drive impact and inspire growth.
                        </p>
                    </motion.div>

                    <div className="absolute inset-0 w-full h-full pointer-events-none flex items-start justify-center top-30">
                        <FloatingCube
                            style={{
                                x: cube1.x,
                                y: cube1.y,
                                scale: cube1.scale,
                                opacity: cube1.opacity,
                            }}
                            images={["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg"]}
                            rotateX={cubeRotateX}
                            rotateY={cubeRotateY}
                            individualRotateY={individualRotateY}
                            rotateZ={cube1.rotation}
                        />

                        <FloatingCube
                            style={{
                                x: cube2.x,
                                y: cube2.y,
                                scale: cube2.scale,
                                opacity: cube2.opacity,
                            }}
                            images={["/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg", "/img1.jpg"]}
                            rotateX={cubeRotateX}
                            rotateY={cubeRotateY}
                            individualRotateY={individualRotateY}
                            rotateZ={cube2.rotation}
                        />

                        <FloatingCube
                            style={{
                                x: cube3.x,
                                y: cube3.y,
                                scale: cube3.scale,
                                opacity: cube3.opacity,
                            }}
                            images={["/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg", "/img1.jpg", "/img2.jpg"]}
                            rotateX={cubeRotateX}
                            rotateY={cubeRotateY}
                            individualRotateY={individualRotateY}
                            rotateZ={cube3.rotation}
                        />

                        <FloatingCube
                            style={{
                                x: cube4.x,
                                y: cube4.y,
                                scale: cube4.scale,
                                opacity: cube4.opacity,
                            }}
                            images={["/img4.jpg", "/img5.jpg", "/img6.jpg", "/img1.jpg", "/img2.jpg", "/img3.jpg"]}
                            rotateX={cubeRotateX}
                            rotateY={cubeRotateY}
                            individualRotateY={individualRotateY}
                            rotateZ={cube4.rotation}
                        />

                        <FloatingCube
                            style={{
                                x: cube5.x,
                                y: cube5.y,
                                scale: cube5.scale,
                                opacity: cube5.opacity,
                            }}
                            images={["/img5.jpg", "/img6.jpg", "/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"]}
                            rotateX={cubeRotateX}
                            rotateY={cubeRotateY}
                            individualRotateY={individualRotateY}
                            rotateZ={cube5.rotation}
                        />

                        <FloatingCube
                            style={{
                                x: cube6.x,
                                y: cube6.y,
                                scale: cube6.scale,
                                opacity: cube6.opacity,
                            }}
                            images={["/img6.jpg", "/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg"]}
                            rotateX={cubeRotateX}
                            rotateY={cubeRotateY}
                            individualRotateY={individualRotateY}
                            rotateZ={cube6.rotation}
                        />
                    </div>
                </div>
            </section>

            <div className="flex min-h-screen grow items-center justify-center bg-[#CDB9AB] text-[#331D10] z-20 relative">
                <p className="text-sm font-medium tracking-wide">Your next section goes here.</p>
            </div>
        </div>
    );
};

export default LandingPage;
