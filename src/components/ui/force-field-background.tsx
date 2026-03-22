"use client";

import React, { useEffect, useRef, useState } from 'react';
// import type p5 from 'p5'; // Commented out to avoid build error when p5 is not installed

export interface ForceFieldBackgroundProps {
    /**
     * URL of the image to use as the base for the particle field
     * @default "https://cdn.pixabay.com/photo/2024/12/13/20/29/alps-9266131_1280.jpg"
     */
    imageUrl?: string;
    /**
     * Base hue for the color palette (0-360)
     * @default 210
     */
    hue?: number;
    /**
     * Color saturation (0-100)
     * @default 100
     */
    saturation?: number;
    /**
     * Brightness threshold for particle visibility (0-255)
     * @default 255
     */
    threshold?: number;
    /**
     * Minimum stroke weight for particles
     * @default 2
     */
    minStroke?: number;
    /**
     * Maximum stroke weight for particles
     * @default 6
     */
    maxStroke?: number;
    /**
     * Spacing between particles (lower = more density)
     * @default 10
     */
    spacing?: number;
    /**
     * Noise scale for particle placement irregularity
     * @default 0
     */
    noiseScale?: number;
    /**
     * Density factor (probability of particle existence)
     * @default 2.0
     */
    density?: number;
    /**
     * Invert the source image brightness mapping
     * @default true
     */
    invertImage?: boolean;
    /**
     * Invert the wireframe/particle visibility condition
     * @default true
     */
    invertWireframe?: boolean;
    /**
     * Enable the magnifier/force field effect
     * @default true
     */
    magnifierEnabled?: boolean;
    /**
     * Radius of the force field effect around the cursor
     * @default 150
     */
    magnifierRadius?: number;
    /**
     * Strength of the force pushing particles away
     * @default 10
     */
    forceStrength?: number;
    /**
     * Friction factor for particle movement (0-1)
     * @default 0.9
     */
    friction?: number;
    /**
     * Speed at which particles return to original position
     * @default 0.05
     */
    restoreSpeed?: number;
    /**
     * Additional CSS class names
     */
    className?: string;
}

/**
 * ForceFieldBackground
 * 
 * An interactive, particle-based background that reacts to mouse movement.
 * It uses an underlying image to determine particle color and size, creating
 * a "force field" effect where particles are pushed away by the cursor.
 */
export function ForceFieldBackground({
    imageUrl = "https://cdn.pixabay.com/photo/2024/12/13/20/29/alps-9266131_1280.jpg",
    hue = 160, // Emerald-ish for GreenPe
    saturation = 80,
    threshold = 255,
    minStroke = 2,
    maxStroke = 6,
    spacing = 10,
    noiseScale = 0,
    density = 2.0,
    invertImage = true,
    invertWireframe = true,
    magnifierEnabled = true,
    magnifierRadius = 150,
    forceStrength = 10,
    friction = 0.9,
    restoreSpeed = 0.05,
    className = "",
}: ForceFieldBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<any>(null); // Changed from p5 to any
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Keep latest props in ref to access inside p5 closure without re-instantiating
    const propsRef = useRef({
        hue, saturation, threshold, minStroke, maxStroke, spacing, noiseScale,
        density, invertImage, invertWireframe, magnifierEnabled, magnifierRadius,
        forceStrength, friction, restoreSpeed
    });

    useEffect(() => {
        propsRef.current = {
            hue, saturation, threshold, minStroke, maxStroke, spacing, noiseScale,
            density, invertImage, invertWireframe, magnifierEnabled, magnifierRadius,
            forceStrength, friction, restoreSpeed
        };
    }, [hue, saturation, threshold, minStroke, maxStroke, spacing, noiseScale, density, invertImage, invertWireframe, magnifierEnabled, magnifierRadius, forceStrength, friction, restoreSpeed]);

    useEffect(() => {
        if (!containerRef.current) return;

        let myP5: any = null;
        let isMounted = true;

        const initP5 = async () => {
            // @ts-ignore - p5 is optional and loaded dynamically
            const p5Module = await import('p5');
            const P5 = p5Module.default;
            if (!isMounted || !containerRef.current) return;

            const sketch = (p: any) => {
                let originalImg: any;
                let img: any;
                let palette: any[] = [];
                let points: {
                    pos: any;
                    originalPos: any;
                    vel: any;
                }[] = [];

                let lastHue = -1;
                let lastSaturation = -1;
                let lastSpacing = -1;
                let lastNoiseScale = -1;
                let lastDensity = -1;
                let lastInvertImage: boolean | null = null;
                let magnifierX = 0;
                let magnifierY = 0;
                let magnifierInertia = 0.1;

                p.setup = async () => {
                    const { clientWidth, clientHeight } = containerRef.current!;
                    p.createCanvas(clientWidth, clientHeight);
                    magnifierX = p.width / 2;
                    magnifierY = p.height / 2;

                    try {
                        originalImg = await p.loadImage(imageUrl);
                        setIsLoading(false);
                        processImage();
                        generatePalette(propsRef.current.hue, propsRef.current.saturation);
                        generatePoints();
                    } catch (err) {
                        console.error("Failed to load image", err);
                        setError("Failed to load image");
                        setIsLoading(false);
                    }
                };

                p.windowResized = () => {
                    if (!containerRef.current || !originalImg) return;
                    const { clientWidth, clientHeight } = containerRef.current;
                    p.resizeCanvas(clientWidth, clientHeight);
                    processImage();
                    generatePoints();
                };

                function processImage() {
                    if (!originalImg) return;
                    img = originalImg.get();
                    if (p.width > 0 && p.height > 0) {
                        img.resize(p.width, p.height);
                    }
                    img.filter(p.GRAY);

                    if (propsRef.current.invertImage) {
                        img.loadPixels();
                        for (let i = 0; i < img.pixels.length; i += 4) {
                            img.pixels[i] = 255 - img.pixels[i];
                            img.pixels[i + 1] = 255 - img.pixels[i + 1];
                            img.pixels[i + 2] = 255 - img.pixels[i + 2];
                        }
                        img.updatePixels();
                    }
                    lastInvertImage = propsRef.current.invertImage;
                }

                function generatePalette(h: number, s: number) {
                    palette = [];
                    p.push();
                    p.colorMode(p.HSL);
                    for (let i = 0; i < 12; i++) {
                        let lightness = p.map(i, 0, 11, 95, 5);
                        palette.push(p.color(h, s, lightness));
                    }
                    p.pop();
                }

                function generatePoints() {
                    if (!img) return;
                    points = [];
                    const { spacing, density, noiseScale } = propsRef.current;
                    const safeSpacing = Math.max(2, spacing);

                    for (let y = 0; y < img.height; y += safeSpacing) {
                        for (let x = 0; x < img.width; x += safeSpacing) {
                            if (p.random() > density) continue;

                            let nx = p.noise(x * noiseScale, y * noiseScale) - 0.5;
                            let ny = p.noise((x + 500) * noiseScale, (y + 500) * noiseScale) - 0.5;
                            let px = x + nx * safeSpacing;
                            let py = y + ny * safeSpacing;

                            points.push({
                                pos: p.createVector(px, py),
                                originalPos: p.createVector(px, py),
                                vel: p.createVector(0, 0)
                            });
                        }
                    }

                    lastSpacing = spacing;
                    lastNoiseScale = noiseScale;
                    lastDensity = density;
                }

                function applyForceField(mx: number, my: number) {
                    const props = propsRef.current;
                    if (!props.magnifierEnabled) return;

                    for (let pt of points) {
                        // Use instance methods for cross-version compatibility
                        let dir = pt.pos.copy().sub(p.createVector(mx, my));
                        let d = dir.mag();

                        if (d < props.magnifierRadius) {
                            dir.normalize();
                            let force = dir.mult(props.forceStrength / Math.max(1, d));
                            pt.vel.add(force);
                        }

                        pt.vel.mult(props.friction);
                        let restore = pt.pos.copy().sub(pt.originalPos).mult(-props.restoreSpeed);
                        pt.vel.add(restore);
                        pt.pos.add(pt.vel);
                    }
                }

                p.draw = () => {
                    if (!img) return;
                    p.background(0);
                    const props = propsRef.current;

                    if (props.hue !== lastHue || props.saturation !== lastSaturation) {
                        generatePalette(props.hue, props.saturation);
                        lastHue = props.hue;
                        lastSaturation = props.saturation;
                    }

                    if (props.invertImage !== lastInvertImage) {
                        processImage();
                    }

                    if (props.spacing !== lastSpacing || props.noiseScale !== lastNoiseScale || props.density !== lastDensity) {
                        generatePoints();
                    }

                    magnifierX = p.lerp(magnifierX, p.mouseX, magnifierInertia);
                    magnifierY = p.lerp(magnifierY, p.mouseY, magnifierInertia);

                    applyForceField(magnifierX, magnifierY);

                    img.loadPixels();
                    p.noFill();

                    for (let pt of points) {
                        let x = pt.pos.x;
                        let y = pt.pos.y;
                        let d = p.dist(x, y, magnifierX, magnifierY);

                        let px = p.constrain(p.floor(x), 0, img.width - 1);
                        let py = p.constrain(p.floor(y), 0, img.height - 1);

                        let index = (px + py * img.width) * 4;
                        let brightness = img.pixels[index];

                        if (brightness === undefined) continue;

                        let condition = props.invertWireframe
                            ? brightness < props.threshold
                            : brightness > props.threshold;

                        if (condition) {
                            let shadeIndex = Math.floor(p.map(brightness, 0, 255, 0, palette.length - 1));
                            shadeIndex = p.constrain(shadeIndex, 0, palette.length - 1);

                            let strokeSize = p.map(brightness, 0, 255, props.minStroke, props.maxStroke);

                            if (props.magnifierEnabled && d < props.magnifierRadius) {
                                let factor = p.map(d, 0, props.magnifierRadius, 2, 1);
                                strokeSize *= factor;
                            }

                            if (palette[shadeIndex]) {
                                p.stroke(palette[shadeIndex]);
                                p.strokeWeight(strokeSize);
                                p.point(x, y);
                            }
                        }
                    }
                };
            };

            myP5 = new P5(sketch, containerRef.current!);
            p5InstanceRef.current = myP5;
        };

        initP5();

        return () => {
            isMounted = false;
            if (myP5) {
                myP5.remove();
            }
        };
    }, [imageUrl]);

    return (
        <div
            className={`relative w-full h-full overflow-hidden bg-black ${className}`}
            ref={containerRef}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs tracking-widest uppercase">
                    Initializing Force Field...
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center text-red-500/50 text-xs tracking-widest uppercase">
                    {error}
                </div>
            )}
        </div>
    );
}

export default ForceFieldBackground;
