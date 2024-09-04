import clsx from "clsx";
import React from "react";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  className = "",
}) => {
  const baseStyles =
    "font-semibold rounded-lg focus:outline-none transition-all duration-300 ease-in-out";

  const variantStyles = {
    primary: `
          bg-blue-600 text-white border border-transparent
          hover:bg-white/95 hover:border hover:border-blue-500 hover:text-blue-500
        `,
    secondary: `
          bg-red-500 text-white border border-transparent
          hover:bg-white/95 hover:border hover:border-red-500 hover:text-red-500
        `,
    outlinePrimary: `
          bg-transparent border-2 border-blue-600 text-blue-600 
          hover:bg-blue-600 hover:text-white 
          focus:ring-blue-500
        `,
    outlineSecondary: `
          bg-transparent border-2 border-red-500 text-red-500 
          hover:bg-red-500 hover:text-white 
          focus:ring-red-500
        `,
  };

  const sizeStyles = {
    sm: "px-1 py-1 text-sm",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-5 py-4 text-lg",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      className={clsx(
        sizeStyles[size],
        baseStyles,
        variantStyles[variant],
        widthStyles,
        className,
        { "opacity-50 cursor-not-allowed": disabled }
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
