import { twMerge } from "tailwind-merge";
//method call
const SectionHeading = ({ children, className, ...props }) => {
  return (
    <header
      {...props}
      data-aos="fade-up"
      className={twMerge("mb-16 lg:mb-20", className)}
    >
      {children}
    </header>
  );
};
export default SectionHeading;