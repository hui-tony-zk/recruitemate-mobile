import React from "react";
import { styled } from "@mui/material/styles";

interface AudioDotProps {
  size: number;
}

const Container = styled("div")(({ size }: AudioDotProps) => ({
  width: `${size + 20}px`,
  height: `${size + 20}px`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Dot = styled("div")(({ size }: AudioDotProps) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: "50%",
  backgroundColor: "#fff",
  transition: "transform .2s ease-in-out",
  willChange: "transform",
  visibility: size > 0 ? "visible" : "hidden",
  border: `1px solid #fff`,
  boxShadow: `0px 0px 6px 1px #fff`,
  transformOrigin: "center",
}));

const AudioDot: React.FC<AudioDotProps> = ({ size }) => {
  return (
    <Container size={size}>
      <Dot size={size}></Dot>
    </Container>
  );
};

export default AudioDot;