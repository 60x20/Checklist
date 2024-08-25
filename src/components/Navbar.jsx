import { useContext } from 'react';

// context providers
import { menuStateContext } from '../providers/MenuStateProvider';
import { themeContext } from '../providers/ThemeProvider';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const { menuState, toggleMenuState } = useContext(menuStateContext);
  const { preferenceForDark, togglePreferenceForDark } = useContext(themeContext);

  return (
    <nav id="top-navigation-bar" className="text-and-group-row-container">
      <h2>Checklist</h2>
      <button
        className="toggler-with-icon"
        onClick={() => toggleMenuState()}
        title={menuState ? "Close menu" : "Open menu"}
        aria-expanded={menuState}
        aria-controls="menu"
        type="button"
      >
        <FontAwesomeIcon icon={menuState ? faXmark : faBars} />
      </button>
    </nav>
  );
};
 
export default Navbar;