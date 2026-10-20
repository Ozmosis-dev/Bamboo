"use client";

import { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const INTRO_DONE_EVENT = "bamboo:intro-done";

/** One bamboo stalk drawn with culm segments and a few leaves. */
function Stalk({ x, h, lean = 0 }: { x: number; h: number; lean?: number }) {
  const nodes = [0.22, 0.42, 0.62, 0.82];
  return (
    <g stroke="#8a8a84" strokeWidth="2.5" fill="none" transform={`rotate(${lean} ${x} 900)`}>
      <path d={`M ${x} 900 L ${x} ${900 - h}`} strokeWidth="7" opacity="0.8" />
      {nodes.map((t) => (
        <path key={t} d={`M ${x - 7} ${900 - h * t} h 14`} strokeWidth="2" />
      ))}
      <path d={`M ${x} ${900 - h * 0.62} q 22 -14 44 -16 M ${x + 30} ${900 - h * 0.66} q 14 10 30 10`} opacity="0.7" />
      <path d={`M ${x} ${900 - h * 0.86} q -20 -16 -42 -18 M ${x - 28} ${900 - h * 0.9} q -12 10 -26 12`} opacity="0.7" />
    </g>
  );
}

/** Full-screen opener: faint monochrome bamboo forest, the mark breathes in,
 * a vermilion rule draws, then the curtain wipes up and hands off to the
 * page's own entrance (MarketFx waits for INTRO_DONE_EVENT). Plays once per
 * session; skipped entirely under prefers-reduced-motion. */
export function MarketIntro() {
  const [gone, setGone] = useState(false);

  useGSAP(() => {
    const el = document.querySelector<HTMLElement>("[data-intro]");
    if (!el) return;

    const done = () => {
      try {
        sessionStorage.setItem("bamboo-intro", "1");
      } catch {}
      // Mark completion on the element too: effects that run after this one
      // must not wait for an event that already fired.
      el.setAttribute("data-intro-done", "1");
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      setGone(true);
      document.documentElement.style.overflow = "";
    };

    const seen = (() => {
      try {
        return sessionStorage.getItem("bamboo-intro") === "1";
      } catch {
        return false;
      }
    })();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      done();
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const tl = gsap.timeline({ onComplete: done });
    tl.to("[data-intro-forest]", { opacity: 0.13, duration: 1.4, ease: "power2.out" }, 0)
      .fromTo(
        "[data-intro-forest]",
        { scale: 1.08 },
        { scale: 1, duration: 2.4, ease: "power1.out" },
        0
      )
      .fromTo(
        "[data-intro-mark]",
        { autoAlpha: 0, y: 26, scale: 0.94, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out" },
        0.25
      )
      .fromTo(
        "[data-intro-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        0.7
      )
      .fromTo(
        "[data-intro-word]",
        { autoAlpha: 0, letterSpacing: "0.6em" },
        { autoAlpha: 1, letterSpacing: "0.34em", duration: 1, ease: "power2.out" },
        0.85
      )
      // hold, then leave
      .to(
        "[data-intro-mark], [data-intro-word], [data-intro-rule]",
        { autoAlpha: 0, y: -18, duration: 0.5, ease: "power2.in" },
        2.3
      )
      .to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 2.55);

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  });

  if (gone) return null;

  return (
    <div
      data-intro
      aria-hidden
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-char-deep"
    >
      {/* Faint monochrome bamboo forest */}
      <svg
        data-intro-forest
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-0"
      >
        <Stalk x={90} h={860} lean={-2} />
        <Stalk x={235} h={780} lean={1.5} />
        <Stalk x={360} h={880} lean={-1} />
        <Stalk x={540} h={760} lean={2} />
        <Stalk x={700} h={870} lean={-1.5} />
        <Stalk x={860} h={800} lean={1} />
        <Stalk x={1010} h={880} lean={-2.5} />
        <Stalk x={1130} h={790} lean={2} />
      </svg>
      {/* vignette so the stalks stay a whisper at the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, transparent 30%, var(--color-char-deep) 95%)",
        }}
      />

      <div className="relative flex flex-col items-center px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-intro-mark
          src="/brand/logo-mark-white.png"
          alt=""
          className="h-32 w-auto opacity-0 sm:h-44"
        />
        <span
          data-intro-rule
          className="mt-8 h-px w-24 origin-center scale-x-0 bg-verm"
        />
        <p
          data-intro-word
          className="m-caps mt-6 text-center text-[13px] !font-bold text-washi opacity-0"
        >
          Bamboo <span className="font-normal text-tatami">on Market</span>
        </p>
      </div>
    </div>
  );
}
