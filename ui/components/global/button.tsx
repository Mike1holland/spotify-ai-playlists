import type React from "react";

const Button = ({
  text,
  href,
  buttonType,
  buttonClass,
  onClick,
}: ButtonProps) => {
  const classes = [
    buttonClass,
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "cursor-pointer",
    "text-2xl",
    "py-4",
    "rounded-md",
    "px-8",
    "m-2",
    "font-semibold",
    "border-2",
  ];

  switch (buttonType) {
    case ButtonType.Link:
      return (
        <a className={classes.join(" ")} href={href}>
          {text}
        </a>
      );
    case ButtonType.Button:
    default:
      return (
        <button onClick={onClick} className={classes.join(" ")}>
          {text}
        </button>
      );
  }
};

enum ButtonType {
  Button = "button",
  Link = "a",
}

enum ButtonClass {
  Primary = "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:border-blue-500",
  Secondary = "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:border-blue-500",
  Tertiary = "bg-transparent text-black border-gray-500 hover:bg-gray-200 active:bg-gray-300 focus:border-blue-500",
}

export default Button;
export { ButtonType, ButtonClass };

interface TypeButtonProps {
  text: string;
  buttonClass: ButtonClass;
  onClick?: React.MouseEventHandler;
  href?: never;
  buttonType?: ButtonType.Button;
}
interface TypeLinkProps {
  text: string;
  buttonClass: ButtonClass;
  onClick?: never;
  href: string;
  buttonType: ButtonType.Link;
}

type ButtonProps = TypeButtonProps | TypeLinkProps;
