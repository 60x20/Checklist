import { useContext } from 'react';
import { Link } from 'react-router-dom';

// context providers
import { menuStateContext } from '../providers/MenuStateProvider';
import { themeContext } from '../providers/ThemeProvider';
import { refContext } from '../providers/RefProvider';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

// helpers
import { returnThemeMode, themeModeData } from '../helpers/themeHelpers';

const Header = () => {
  const { menuState, toggleMenuState } = useContext(menuStateContext);
  const { preferenceForDark, themeMode, toggleThemeMode } = useContext(themeContext);
  const { refs: { menuTogglerRef } } = useContext(refContext);

  return (
    <header id="top-header" className="text-and-group-row-container">
      <h2 id="logo"><Link to="/">Checklist</Link></h2>
      <button
        type="button"
        id="theme-toggler"
        onClick={() => toggleThemeMode()}
        title={`Switch to ${themeModeData[returnThemeMode(themeMode + 1)].asWord} theme.`}
      >
        <span className={preferenceForDark ? 'moon-color' : 'sun-color'}>
          <FontAwesomeIcon icon={themeModeData[themeMode].icon} />
        </span>
        theme
      </button>
      <button
        type="button"
        className="toggler-with-icon"
        id="menu-toggler"
        ref={menuTogglerRef}
        onClick={() => toggleMenuState()}
        title={menuState ? "Close menu" : "Open menu"}
        aria-expanded={menuState}
        aria-controls="menu"
      >
        <FontAwesomeIcon icon={menuState ? faXmark : faBars} />
      </button>
    </header>
  );
};
 
export default Header;