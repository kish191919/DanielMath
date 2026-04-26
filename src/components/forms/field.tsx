import * as React from "react";
import { Label } from "@/components/ui/label";

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-600 font-ko" lang="ko" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const Radio = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(function Radio({ label, ...props }, ref) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 hover:bg-navy-50 has-[:checked]:border-navy-500 has-[:checked]:bg-navy-50 has-[:checked]:text-navy-900">
      <input ref={ref} type="radio" className="h-4 w-4 accent-navy-700" {...props} />
      <span>{label}</span>
    </label>
  );
});
