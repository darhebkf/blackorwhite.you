import type { AnchorHTMLAttributes, ReactNode } from "react";

type SwipeLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export function SwipeLink({
  href,
  children,
  className,
  ...rest
}: SwipeLinkProps) {
  return (
    <a
      href={href}
      className={`group relative inline-block pb-1 ${className ?? ""}`.trim()}
      style={{ textDecoration: "none" }}
      {...rest}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 h-px w-full bg-current transition-all duration-300 group-hover:w-0 group-focus-visible:w-0"
      />
    </a>
  );
}
