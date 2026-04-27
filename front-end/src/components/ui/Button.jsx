import { cn } from "../../lib/design/cn";



const variants = {
  primary: "bg-(--brand-primary) text-white hover:bg-(--brand-primary-hover)",
  secondary: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  light: "bg-slate-100 hover:bg-(--brand-primary-hover)  hover:text-(--brand-light)",
  design: "bg-linear-to-tl from-(--brand-primary-light) via-60% via-(--brand-primary) to-(--brand-primary-light) text-black  py-3 font-bold hover:bg-slate-800 transition-all  shadow-(--shadow-lg) hover:text-white text-center hover:-translate-y-0.5  hover:shadow-2xs duration-600"
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "rounded-xl font-semibold transition-all active:scale-95 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;