import React from "react";
import "./Loader.css";
import { Box } from "@chakra-ui/react";

const Loader = () => {
  const squares = Array.from({ length: 9 });

  return (
    <div className="loader-wrapper">
      {/* 🔥 Blurred red background shapes */}
      <Box
        position="absolute"
        left="0"
        top="50%"
        transform="translateY(-60%) rotate(-15deg)"
        width={{ base: "100%", md: "400px" }}
        height={{ base: "300px", md: "400px" }}
        bg="#E30004"
        filter="blur(250px)"
        opacity={0.7}
        zIndex="1"
      />
      <Box
        position="absolute"
        right="0"
        top="50%"
        transform="translateY(-50%) rotate(15deg)"
        width={{ base: "100%", md: "400px" }}
        height={{ base: "300px", md: "400px" }}
        bg="#E30004"
        filter="blur(250px)"
        opacity={0.7}
        zIndex="1"
      />

      {/* Loader squares */}
      <div className="loader-container">
        {squares.map((_, i) => (
          <div className="loader-square" key={i}></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
