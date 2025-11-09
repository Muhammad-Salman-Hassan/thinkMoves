import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Flex } from "@chakra-ui/react";

export default function MainLayout() {
  return (
    <>
      <Flex direction="column" minH="100vh">
        <Navbar />

       
          <Box as="main" flex="1">
            <Outlet />
          </Box>
        


      </Flex>
      <Footer />
    </>
  );
}
