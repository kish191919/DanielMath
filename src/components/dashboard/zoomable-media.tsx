"use client";

import * as React from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoomableMediaProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  minScale?: number;
  maxScale?: number;
  doubleTapScale?: number;
  label?: string;
}

interface Transform {
  scale: number;
  x: number;
  y: number;
}

const TAP_MOVE_THRESHOLD = 10;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DIST = 30;
const ZOOM_STEP = 1.5;
const EPS = 0.01;

export const ZoomableMedia = React.forwardRef<HTMLDivElement, ZoomableMediaProps>(
  function ZoomableMedia(
    {
      children,
      className,
      contentClassName,
      minScale = 1,
      maxScale = 4,
      doubleTapScale = 2.5,
      label,
    },
    forwardedRef,
  ) {
    const viewportRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const transformRef = React.useRef<Transform>({ scale: minScale, x: 0, y: 0 });
    const pointersRef = React.useRef<Map<number, { x: number; y: number }>>(new Map());
    const gestureRef = React.useRef<{
      pinchStartDist: number;
      pinchStartScale: number;
      lastMid: { x: number; y: number };
      lastSingle: { x: number; y: number } | null;
      moved: number;
      wasPinch: boolean;
    }>({
      pinchStartDist: 0,
      pinchStartScale: minScale,
      lastMid: { x: 0, y: 0 },
      lastSingle: null,
      moved: 0,
      wasPinch: false,
    });
    const lastTapRef = React.useRef<{ time: number; x: number; y: number } | null>(null);
    const [scale, setScale] = React.useState(minScale);

    React.useImperativeHandle(forwardedRef, () => viewportRef.current!, []);

    const setTouchAction = React.useCallback((value: string) => {
      if (viewportRef.current) viewportRef.current.style.touchAction = value;
    }, []);

    const applyTransform = React.useCallback(
      (nextScale: number, nextX: number, nextY: number, options?: { animate?: boolean }) => {
        const viewport = viewportRef.current;
        const content = contentRef.current;
        if (!viewport || !content) return;

        const s = Math.min(maxScale, Math.max(minScale, nextScale));
        const w = viewport.clientWidth;
        const h = viewport.clientHeight;
        const loX = w * (1 - s);
        const loY = h * (1 - s);
        const clampedX = Math.min(Math.max(0, loX), Math.max(nextX, Math.min(0, loX)));
        const clampedY = Math.min(Math.max(0, loY), Math.max(nextY, Math.min(0, loY)));

        transformRef.current = { scale: s, x: clampedX, y: clampedY };
        content.style.transition = options?.animate
          ? "transform 200ms ease-out"
          : "";
        content.style.transform = `translate(${clampedX}px, ${clampedY}px) scale(${s})`;
        if (options?.animate) {
          window.setTimeout(() => {
            if (content) content.style.transition = "";
          }, 220);
        }
      },
      [minScale, maxScale],
    );

    const anchoredZoom = React.useCallback(
      (px: number, py: number, nextScale: number, options?: { animate?: boolean }) => {
        const { scale: sOld, x: xOld, y: yOld } = transformRef.current;
        const sNew = Math.min(maxScale, Math.max(minScale, nextScale));
        const xNew = px - ((px - xOld) / sOld) * sNew;
        const yNew = py - ((py - yOld) / sOld) * sNew;
        applyTransform(sNew, xNew, yNew, options);
      },
      [minScale, maxScale, applyTransform],
    );

    const toggleZoomAt = React.useCallback(
      (clientX: number, clientY: number) => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const rect = viewport.getBoundingClientRect();
        const px = clientX - rect.left;
        const py = clientY - rect.top;
        const isZoomed = transformRef.current.scale > minScale + EPS;
        if (isZoomed) {
          applyTransform(minScale, 0, 0, { animate: true });
        } else {
          anchoredZoom(px, py, doubleTapScale, { animate: true });
        }
        setScale(transformRef.current.scale);
      },
      [minScale, doubleTapScale, applyTransform, anchoredZoom],
    );

    const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y);

    const midpoint = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    });

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      viewport.setPointerCapture(e.pointerId);
      const rect = viewport.getBoundingClientRect();
      const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      pointersRef.current.set(e.pointerId, point);

      const gesture = gestureRef.current;
      gesture.moved = 0;
      gesture.wasPinch = false;

      if (pointersRef.current.size === 2) {
        setTouchAction("none");
        const [a, b] = Array.from(pointersRef.current.values());
        gesture.pinchStartDist = distance(a, b);
        gesture.pinchStartScale = transformRef.current.scale;
        gesture.lastMid = midpoint(a, b);
        gesture.wasPinch = true;
        gesture.lastSingle = null;
      } else if (pointersRef.current.size === 1) {
        gesture.lastSingle = point;
        if (transformRef.current.scale > minScale + EPS) {
          setTouchAction("none");
        }
      }
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const viewport = viewportRef.current;
      if (!viewport || !pointersRef.current.has(e.pointerId)) return;
      const rect = viewport.getBoundingClientRect();
      const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      pointersRef.current.set(e.pointerId, point);
      const gesture = gestureRef.current;

      if (pointersRef.current.size === 2) {
        e.preventDefault();
        const [a, b] = Array.from(pointersRef.current.values());
        const dist = distance(a, b);
        const mid = midpoint(a, b);
        const nextScale =
          (gesture.pinchStartDist > 0
            ? gesture.pinchStartScale * (dist / gesture.pinchStartDist)
            : gesture.pinchStartScale);
        anchoredZoom(mid.x, mid.y, nextScale);
        gesture.lastMid = mid;
      } else if (pointersRef.current.size === 1 && transformRef.current.scale > minScale + EPS) {
        e.preventDefault();
        const last = gesture.lastSingle ?? point;
        const dx = point.x - last.x;
        const dy = point.y - last.y;
        gesture.moved += Math.hypot(dx, dy);
        gesture.lastSingle = point;
        const { scale: s, x, y } = transformRef.current;
        applyTransform(s, x + dx, y + dy);
      } else if (pointersRef.current.size === 1) {
        const last = gesture.lastSingle ?? point;
        gesture.moved += Math.hypot(point.x - last.x, point.y - last.y);
        gesture.lastSingle = point;
      }
    };

    const endPointer = (e: React.PointerEvent<HTMLDivElement>, isTapCandidate: boolean) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.delete(e.pointerId);
      const gesture = gestureRef.current;

      if (pointersRef.current.size === 0) {
        setScale(transformRef.current.scale);
        if (transformRef.current.scale <= minScale + EPS) {
          setTouchAction("");
        }

        if (
          isTapCandidate &&
          e.pointerType === "touch" &&
          !gesture.wasPinch &&
          gesture.moved < TAP_MOVE_THRESHOLD
        ) {
          if (transformRef.current.scale <= minScale + EPS) {
            // Not zoomed: a single tap zooms in on that exact spot immediately —
            // waiting for a double-tap makes precisely targeting small text too hard.
            toggleZoomAt(e.clientX, e.clientY);
            lastTapRef.current = null;
          } else {
            // Zoomed: still require a double-tap to reset, so a small
            // no-movement tap while fine-tuning the pan doesn't reset it.
            const now = Date.now();
            const last = lastTapRef.current;
            if (
              last &&
              now - last.time < DOUBLE_TAP_MS &&
              Math.hypot(e.clientX - last.x, e.clientY - last.y) < DOUBLE_TAP_DIST
            ) {
              toggleZoomAt(e.clientX, e.clientY);
              lastTapRef.current = null;
            } else {
              lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
            }
          }
        }
      } else if (pointersRef.current.size === 1) {
        const [remaining] = Array.from(pointersRef.current.values());
        gesture.lastSingle = remaining;
        gesture.wasPinch = true;
      }
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => endPointer(e, true);
    const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => endPointer(e, false);
    const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.buttons === 0 && pointersRef.current.has(e.pointerId)) {
        endPointer(e, false);
      }
    };

    const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      toggleZoomAt(e.clientX, e.clientY);
    };

    const zoomButton = (nextScale: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const cx = viewport.clientWidth / 2;
      const cy = viewport.clientHeight / 2;
      anchoredZoom(cx, cy, nextScale, { animate: true });
      setScale(transformRef.current.scale);
    };

    const isZoomedIn = scale > minScale + EPS;

    return (
      <div
        ref={viewportRef}
        role="group"
        aria-label={label}
        className={cn("relative touch-pan-y overscroll-contain select-none", className)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
        onDoubleClick={onDoubleClick}
      >
        <div
          ref={contentRef}
          className={cn("origin-top-left", contentClassName)}
          style={{ transform: `translate(0px, 0px) scale(${minScale})` }}
        >
          {children}
        </div>
        <div className="absolute bottom-2 right-2 z-10 flex flex-col gap-1">
          <button
            type="button"
            aria-label="확대"
            onClick={() => zoomButton(transformRef.current.scale * ZOOM_STEP)}
            disabled={scale >= maxScale - EPS}
            className="rounded-full bg-white/90 p-1.5 text-navy-600 shadow-sm ring-1 ring-navy-100 hover:bg-white hover:text-navy-900 disabled:opacity-40"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="축소"
            onClick={() => zoomButton(transformRef.current.scale / ZOOM_STEP)}
            disabled={!isZoomedIn}
            className="rounded-full bg-white/90 p-1.5 text-navy-600 shadow-sm ring-1 ring-navy-100 hover:bg-white hover:text-navy-900 disabled:opacity-40"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="원래대로"
            onClick={() => {
              applyTransform(minScale, 0, 0, { animate: true });
              setScale(minScale);
            }}
            disabled={!isZoomedIn}
            className="rounded-full bg-white/90 p-1.5 text-navy-600 shadow-sm ring-1 ring-navy-100 hover:bg-white hover:text-navy-900 disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  },
);
