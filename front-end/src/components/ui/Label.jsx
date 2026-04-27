import { cn } from "../../lib/design/cn";



const variants = {
  primary: "text-(--color-info)",
  secondary: "text-slate-800 border",
  ghost: "text-slate-600 ",
};

const sizes = {
  sm: "px-2 py-1.5 text-sm",
  md: "px-3 py-1.5 text-md",
  lg: "px-3 py-2 text-lg",
};



const Label = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  return (
    <label
      className={cn(
        "font-semibold transition-all active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;