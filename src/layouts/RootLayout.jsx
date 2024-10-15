import { Outlet } from "react-router-dom";

// components
import Header from "../components/Header";
import Menu from "../components/Menu";
import Main from "../components/Main";
import Footer from "../components/Footer";

// context providers
import MenuStateProvider from "../providers/MenuStateProvider";
import CurrentDateProvider from "../providers/CurrentDateProvider";
import ThemeProvider from "../providers/ThemeProvider";
import RefProvider from "../providers/RefProvider";

// validators
import { validateTodosTemplate } from "../helpers/todosTemplateHelpers";
import { validateAllTodos } from "../helpers/allTodosHelpers";
import { validateAllYears } from "../helpers/allYearsHelpers";

// make checkboxes interactable with 'enter'
document.addEventListener('keydown', e => {
  // keydown prefferred since keyup can trigger on a checkbox after keydown pressed on a button that moves the focus
  if (e.key === 'Enter' && e.target.matches('input[type="checkbox"]')) {
    e.target.click();
    e.preventDefault(); // in case browser already implements it, avoiding extra clicks
  }
});

const RootLayout = () => {
  // validation for localStorage entries; they must exist
  validateTodosTemplate();
  validateAllTodos();
  validateAllYears();

  return (<>
    <ThemeProvider>
      <RefProvider>
        <MenuStateProvider>
          <Header />
          <CurrentDateProvider>
            <Main>
              <Menu />
              <Outlet />
            </Main>
          </CurrentDateProvider>
        </MenuStateProvider>
      </RefProvider>
      <Footer />
    </ThemeProvider>
  </>);
}

export default RootLayout;