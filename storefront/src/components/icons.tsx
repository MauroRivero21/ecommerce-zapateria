import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const SearchIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.4-3.4" />
  </svg>
);

export const BagIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M6 8h12l1 12H5L6 8Z" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
  </svg>
);

export const MenuIcon = ({ size = 22, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const CloseIcon = ({ size = 22, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
);

export const ArrowRightIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRightIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ChevronDownIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const PlusIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = ({ size = 17, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5" />
  </svg>
);

export const TruckIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const ReturnIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M4 9h11a5 5 0 0 1 0 10H8" />
    <path d="m8 5-4 4 4 4" />
  </svg>
);

export const ShieldIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M12 3 5 6v5c0 4.5 3 7.7 7 10 4-2.3 7-5.5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const CardIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M7 15h3" />
  </svg>
);

export const StarIcon = ({
  size = 14,
  filled = true,
  ...props
}: IconProps & { filled?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.4}
    aria-hidden
    {...props}
  >
    <path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.3 6.5 20.2l1.1-6.2L3 9.6l6.3-.9L12 3Z" />
  </svg>
);

export const FilterIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M3 6h18M6 12h12M10 18h4" />
  </svg>
);

export const LockIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const CheckIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

export const InstagramIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);

export const TikTokIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M14 4v9.2a4.3 4.3 0 1 1-3.6-4.2" />
    <path d="M14 4c.4 2.3 1.8 3.7 4 4" />
  </svg>
);

export const WhatsAppIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" />
    <path d="M9.2 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.1.7l-.5.6c-.1.2-.2.4 0 .7.4.7 1.4 1.7 2.2 2.1.3.1.5.1.7-.1l.6-.6c.2-.2.4-.3.7-.2l1.5.7c.3.1.4.3.4.5v.5c0 .4-.2.9-.6 1.2-.5.4-1.2.6-2 .5-1.2-.2-2.8-.9-4.2-2.2-1.4-1.4-2.2-3-2.3-4.1-.1-.8.1-1.4.5-1.9Z" />
  </svg>
);

export const SparkIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);
