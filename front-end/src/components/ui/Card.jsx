import { cn } from "@/lib/design/cn";

const Card = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bg-white border border-slate-100 rounded-2xl shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;