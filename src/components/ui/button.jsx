import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = (variant = "default", size = "default") => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white font-semibold",
    destructive: "bg-red-600 hover:bg-red-700 text-white font-semibold",
    outline: "border-2 border-gray-600 bg-transparent hover:bg-gray-700 text-white hover:text-white font-medium",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white font-semibold",
    ghost: "bg-transparent hover:bg-gray-700/50 text-white hover:text-white font-medium",
    link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  
  return `${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default}`;
};

const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Component = "button";
  
  return (
    <Component
      className={cn(buttonVariants(variant, size), className)}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };