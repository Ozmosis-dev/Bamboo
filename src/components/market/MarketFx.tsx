"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

/** Declarative scroll choreography for market pages. Mount once per page.
 *
 * - [data-hero]            staggered load reveal (page-load timeline)
 * - [data-fx="rise"]       fade+rise on scroll into view
 * - [data-fx="draw"]       hairline draws in from the left
 * - [data-fx-group]        children stagger-rise as a batch
 * - [data-parallax="0.2"]  scrubbed parallax drift (fraction of own height)
 *
 * All tweens are fromTo with explicit end states so React's dev double-mount
 * can never capture a hidden frame as the target. Skipped entirely under
 * prefers-reduced-motion.
 */
export function MarketFx() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const heroEls = gsap.utils.toArray<HTMLElement>("[data-hero]");
      if (heroEls.length) {
        gsap.fromTo(
          heroEls,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "all",
          }
        );
      }

      gsap.utils.toArray<HTMLElement>('[data-fx="rise"]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 34, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-fx="draw"]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 1.1,
            ease: "power2.inOut",
            clearProps: "all",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fx-group]").forEach((group) => {
        gsap.fromTo(
          Array.from(group.children),
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.07,
            clearProps: "all",
            scrollTrigger: { trigger: group, start: "top 86%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? "0.2");
        gsap.fromTo(
          el,
          { yPercent: -speed * 50 },
          {
            yPercent: speed * 50,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });

    return () => mm.revert();
  });

  return null;
}

/** Smooth-scroll helper for in-page nav (respects reduced motion). */
export function scrollToId(id: string, offsetY = 90) {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const target = document.getElementById(id);
  if (!target) return;
  if (prefersReduced) {
    target.scrollIntoView();
    return;
  }
  gsap.to(window, {
    duration: 0.9,
    ease: "power3.inOut",
    scrollTo: { y: target, offsetY, autoKill: true },
  });
}
