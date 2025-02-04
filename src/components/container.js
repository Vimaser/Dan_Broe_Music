import { twMerge } from "tailwind-merge";
//method call of container
const Container = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={twMerge("max-w-container mx-auto px-container", className)}
    >
      {children}
    </div>
  );
};
export default Container;
