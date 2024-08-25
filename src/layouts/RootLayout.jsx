import { Outlet } from "react-router-dom";

// components
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Main from "../components/Main";
import Footer from "../components/Footer";

// context providers
import MenuStateProvider from "../providers/MenuStateProvider";
import CurrentDateProvider from "../providers/CurrentDateProvider";
import ThemeProvider from "../providers/ThemeProvider";

// validators
import { validateTodosTemplate } from "../helpers/todosTemplateHelpers";
import { validateAllTodos } from "../helpers/allTodosHelpers";
import { validateAllYears } from "../helpers/allYearsHelpers";

// make checkboxes interactable with 'enter'
document.addEventListener('keyup', e => {
  if (e.key === 'Enter' && e.target.matches('input[type="checkbox"]')) {
    e.target.click();
  }
});

const RootLayout = () => {
  // validation for localStorage entries; they must exist
  validateTodosTemplate();
  validateAllTodos();
  validateAllYears();

  return (<>
    <ThemeProvider>
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
    </ThemeProvider>
  </>);
}

export default RootLayout;