import React from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";

interface AudioMicProps {
  volume: number;
}

const Container = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative", // Add this line
});


const OuterCircle = styled("div")({
  width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#ccc"
});

const InnerCircle = styled("div")(({ volume }: AudioMicProps) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: `${10 + (volume * 2 * 50)}px`,
  height: `${10 + (volume * 2 * 50)}px`,
  borderRadius: "50%",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 5
}));

const MicImg = styled(MicIcon)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontSize: "48px",
  color: 'black',
  zIndex: 10
});

const AudioDot: React.FC<AudioMicProps> = ({ volume }) => {
  return (
    <Container>
      <OuterCircle>
        <InnerCircle volume={volume} />
        <MicImg />
      </OuterCircle>
    </Container>
  );
};

export default AudioDot;
