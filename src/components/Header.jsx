import { useContext } from 'react';

// context providers
import { menuStateContext } from '../providers/MenuStateProvider';
import { themeContext } from '../providers/ThemeProvider';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  const { menuState, toggleMenuState } = useContext(menuStateContext);
  const { preferenceForDark, togglePreferenceForDark } = useContext(themeContext);

  return (
    <header id="top-header" className="text-and-group-row-container">
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
      <button
        id="theme-toggler"
        onClick={() => togglePreferenceForDark()}
        title={preferenceForDark ? "Switch to light theme" : "Switch to dark theme"}
      >
        <span className={preferenceForDark ? 'sun-color' : 'moon-color'}>
          <FontAwesomeIcon icon={preferenceForDark ? faSun : faMoon} />
        </span>
        theme
      </button>
    </header>
  );
};
 
export default Header;