import { Box } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import { ColorModeSwitcher } from "../ColorModeSwitcher"



const RootLayout = () => {
  return (
    <Box>
        <ColorModeSwitcher justifySelf="flex-end" />
        <Outlet />
    </Box>
  )
}

export default RootLayout