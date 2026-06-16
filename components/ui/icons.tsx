type IconProps = { className?: string };

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M9 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function UtensilsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6 3v5.5c0 1.1-.9 2-2 2v6.5M6 3c-.6 0-1 .4-1 1v4.5M6 3c.6 0 1 .4 1 1v4.5M14 3v14M11 3v5.5c0 1.66 1.34 3 3 3V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 16V8M8 16V4M12 16v-6M16 16V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 6h12M8 6V4h4v2M7 6v10h6V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScaleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 3v14M4 7h12M6 7l-2 4h4l-2-4Zm8 0-2 4h4l-2-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 17c4-3.5 6-7 6-10a6 6 0 0 0-10 4.5C6 7 4 5 4 5c0 4 2.5 8.5 6 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 17V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LightbulbIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5a5 5 0 0 0-2.5 9.4V14h5v-2.1A5 5 0 0 0 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 16h4M9 18h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5 4.5 4.5V9c0 3.5 2.4 6.8 5.5 8 3.1-1.2 5.5-4.5 5.5-8V4.5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m7.5 10 1.8 1.8L12.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClipboardIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="5.5" y="4.5" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5V3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Decorative bowl illustration for the selected food panel footer. */
export function BowlIllustration({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" aria-hidden="true">
      <ellipse cx="60" cy="68" rx="42" ry="8" fill="currentColor" opacity="0.15" />
      <path
        d="M22 38c0-18 17-28 38-28s38 10 38 28v8c0 10-17 18-38 18S22 56 22 46v-8Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <path
        d="M35 42c8-6 18-9 25-9s17 3 25 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="48" cy="36" r="4" fill="currentColor" opacity="0.2" />
      <circle cx="68" cy="32" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="58" cy="40" r="2.5" fill="currentColor" opacity="0.18" />
      <path
        d="M78 24c2-4 6-6 10-4M42 26c-2-3-6-4-9-2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  );
}
