import React from "react";
import { ButtonInfo } from "@/types/button"; 

interface ButtonProps {
  buttonInfo: ButtonInfo;
}

const Button: React.FC<ButtonProps> = ({ buttonInfo }) => {
  return (
    <div className="button">
      <div className="block button">
        {buttonInfo.name}
      </div>
    </div>
  );
};

export default Button;
