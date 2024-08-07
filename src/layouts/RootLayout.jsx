import { Outlet } from "react-router-dom";

// components
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Main from "../components/Main";
import Footer from "../components/Footer";

// context providers
import MenuStateProvider from "../providers/MenuStateProvider";
import CurrentDateProvider from "../providers/CurrentDateProvider";

const RootLayout = () => {

  return (<>
    <MenuStateProvider>
      <Navbar />
      <CurrentDateProvider>
        <Main>
          <Menu />
          <Outlet />
        </Main>
      </CurrentDateProvider>
    </MenuStateProvider>
    <Footer />
  </>);
}

export default RootLayout;