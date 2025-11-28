"use client";

import React, { useRef, memo } from "react";
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

const CubeLogo = memo(({ style }: { style?: any }) => {
    const baseClass = "absolute w-[36px] h-[36px] bg-[#FFE4D6]";
    return (
        <motion.div style={style} className="relative w-[140px] h-[92px] shrink-0" aria-label="Logo">
            <div className={`${baseClass} -top-1.5 left-1/2 -translate-x-1/2`} />
            <div className={`${baseClass} top-3 left-2 -rotate-45`} />
            <div className={`${baseClass} top-3 right-2 rotate-45`} />
            <div className={`${baseClass} bottom-0 -left-2.5`} />
            <div className={`${baseClass} bottom-0 left-1/2 -translate-x-1/2`} />
            <div className={`${baseClass} bottom-0 -right-2.5`} />
        </motion.div>
    );
});
CubeLogo.displayName = "CubeLogo";

interface FloatingCubeProps {
    images: string[];
    alt?: string;
    className?: string;
    style?: any;
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    individualRotateY?: MotionValue<number>;
}

const FloatingCube: React.FC<FloatingCubeProps> = ({
    images,
    alt = "Cube Side",
    className = "",
    style,
    rotateX,
    rotateY,
    individualRotateY,
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
    start: { x: number; y: number; r: number },
    end: { top: string; left: string; r: number }
) => {
    const PHASE1_END = 0.1;
    const PHASE2_END = 0.33;

    const left = useTransform(
        scrollY,
        [0, PHASE1_END, PHASE2_END],
        [`calc(50% + ${start.x}px)`, `calc(50% + ${start.x}px)`, end.left]
    );

    const top = useTransform(
        scrollY,
        [0, PHASE1_END, PHASE2_END],
        [`calc(100px + ${start.y}px)`, `calc(100px + ${start.y}px)`, end.top]
    );

    const scale = useTransform(scrollY, [0, PHASE1_END, PHASE2_END], [0.25, 0.25, 1]);
    const rotate = useTransform(scrollY, [0, PHASE1_END, PHASE2_END], [start.r, start.r, end.r]);
    const opacity = useTransform(scrollY, [0, 0.05, 0.1], [0, 0, 1]);

    return { left, top, scale, rotate, opacity };
};

const LandingPage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const PHASE1_END = 0.1;
    const PHASE2_END = 0.33;
    const PHASE3_END = 0.67;

    const logoOpacity = useTransform(scrollYProgress, [0, PHASE1_END], [1, 0]);
    const textBlur = useTransform(scrollYProgress, [0, 0.15, 0.25], ["blur(0px)", "blur(0px)", "blur(20px)"]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
    const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.3]);

    const centerTextOpacity = useTransform(scrollYProgress, [PHASE2_END - 0.05, PHASE2_END], [0, 1]);

    const cubeRotateX = useTransform(scrollYProgress, [PHASE1_END, PHASE2_END, PHASE3_END], [45, 135, 360]);

    const cubeRotateY = useTransform(scrollYProgress, [PHASE1_END, PHASE2_END, PHASE3_END], [45, 135, 360]);

    const individualRotateY = useTransform(scrollYProgress, [PHASE3_END, 1], [0, 240]);

    const cube1 = useCubePath(scrollYProgress, { x: 0, y: -6, r: 0 }, { top: "20%", left: "25%", r: 0 });
    const cube2 = useCubePath(scrollYProgress, { x: -35, y: 18, r: -45 }, { top: "50%", left: "15%", r: 0 });
    const cube3 = useCubePath(scrollYProgress, { x: -52, y: 54, r: 0 }, { top: "80%", left: "25%", r: 0 });

    const cube4 = useCubePath(scrollYProgress, { x: 35, y: 18, r: 45 }, { top: "20%", left: "75%", r: 0 });
    const cube5 = useCubePath(scrollYProgress, { x: 0, y: 54, r: 0 }, { top: "50%", left: "85%", r: 0 });
    const cube6 = useCubePath(scrollYProgress, { x: 52, y: 54, r: 0 }, { top: "80%", left: "75%", r: 0 });

    return (
        <div className="flex min-h-screen flex-col font-sans bg-[#331707] text-[#F2EBE3]">
            <GlobalStyles />

            <section ref={containerRef} className="relative w-full h-[600vh]">
                <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
                    <div className="absolute top-[100px] z-50">
                        <CubeLogo style={{ opacity: logoOpacity }} />
                    </div>

                    <motion.div
                        style={{ filter: textBlur, opacity: textOpacity, scale: textScale }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-4"
                    >
                        <section className="max-w-5xl text-center mt-32">
                            <h1 className="font-serif text-[40px] leading-tight md:text-[60px] md:leading-[1.15] font-normal">
                                The First Media Company crafted For the Digital First generation
                            </h1>
                        </section>
                        <div className="animate-bounce mt-20 opacity-50 text-sm">Scroll to Transform ↓</div>
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

                    <div className="absolute inset-0 w-full max-w-6xl mx-auto h-full pointer-events-none">
                        <div className="relative w-full h-full">
                            <FloatingCube
                                style={{ ...cube1, x: "-50%", y: "-50%" }}
                                images={["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg"]}
                                rotateX={cubeRotateX}
                                rotateY={cubeRotateY}
                                individualRotateY={individualRotateY}
                            />

                            <FloatingCube
                                style={{ ...cube2, x: "-50%", y: "-50%" }}
                                images={["/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg", "/img1.jpg"]}
                                rotateX={cubeRotateX}
                                rotateY={cubeRotateY}
                                individualRotateY={individualRotateY}
                            />

                            <FloatingCube
                                style={{ ...cube3, x: "-50%", y: "-50%" }}
                                images={["/img3.jpg", "/img4.jpg", "/img5.jpg", "/img6.jpg", "/img1.jpg", "/img2.jpg"]}
                                rotateX={cubeRotateX}
                                rotateY={cubeRotateY}
                                individualRotateY={individualRotateY}
                            />

                            <FloatingCube
                                style={{ ...cube4, x: "-50%", y: "-50%" }}
                                images={["/img4.jpg", "/img5.jpg", "/img6.jpg", "/img1.jpg", "/img2.jpg", "/img3.jpg"]}
                                rotateX={cubeRotateX}
                                rotateY={cubeRotateY}
                                individualRotateY={individualRotateY}
                            />

                            <FloatingCube
                                style={{ ...cube5, x: "-50%", y: "-50%" }}
                                images={["/img5.jpg", "/img6.jpg", "/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"]}
                                rotateX={cubeRotateX}
                                rotateY={cubeRotateY}
                                individualRotateY={individualRotateY}
                            />

                            <FloatingCube
                                style={{ ...cube6, x: "-50%", y: "-50%" }}
                                images={["/img6.jpg", "/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg"]}
                                rotateX={cubeRotateX}
                                rotateY={cubeRotateY}
                                individualRotateY={individualRotateY}
                            />
                        </div>
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
