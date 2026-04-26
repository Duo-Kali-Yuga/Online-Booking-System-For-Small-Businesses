import { cn } from "../../lib/design/cn";

const ringType = {
  small: "focus:ring-1 focus:ring-blue-500 "
}
const Input = ({ className, ring = "",...props }) => {
  return (
    <input
      className={cn(
        "w-full px-4 py-3 rounded-xl bg-slate-50 outline-none  ",
        className,
        ringType[ring]
      )}
      {...props}
    />
  );
};

export default Input;