"use client";

const PRINT_VIEWPORT_WIDTH = "1024";

export function PrintButton() {
  const handlePrint = () => {
    const meta = document.querySelector('meta[name="viewport"]');
    const original = meta?.getAttribute("content") ?? null;

    if (meta && original !== null) {
      meta.setAttribute("content", `width=${PRINT_VIEWPORT_WIDTH}`);
    }

    const restore = () => {
      if (meta && original !== null) {
        meta.setAttribute("content", original);
      }
      window.removeEventListener("afterprint", restore);
    };

    window.addEventListener("afterprint", restore);
    // Some mobile browsers don't fire `afterprint` reliably; restore as a fallback.
    setTimeout(restore, 1000);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.print());
    });
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="print:hidden rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
    >
      인쇄하기
    </button>
  );
}
