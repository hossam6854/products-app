import React from "react";
import { Loader as Spinner } from "lucide-react";

interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader = ({ size = 24, color = "black" }: LoaderProps) => {
  return <Spinner className="animate-spin" size={size} color={color} />;
};

export default Loader;
