import { Outlet } from "react-router-dom";

// components
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Main from "../components/Main";
import Footer from "../components/Footer";

// context providers
import MenuStateProvider from "../providers/MenuStateProvider";
import CurrentDateProvider from "../providers/CurrentDateProvider";

// helpers
import { validateTodosTemplate } from "../helpers/todosTemplateHelpers";
import { validateAllTodos } from "../helpers/allTodosHelpers";

const RootLayout = () => {
  // validation for localStorage entries of todosTemplate and allTodos; they must exist
  validateTodosTemplate();
  validateAllTodos();

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