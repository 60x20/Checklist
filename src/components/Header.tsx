import { useContext } from 'react';
import { Link } from 'react-router-dom';

// context providers
import { menuStateContext } from '../providers/MenuStateProvider';
import { themeContext } from '../providers/ThemeProvider';
import { refContext } from '../providers/RefProvider';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

// helpers
import { returnThemeMode, themeModeData } from '../helpers/themeHelpers';

const Header = () => {
  const { menuState, toggleMenuState } = useContext(menuStateContext);
  const { preferenceForDark, themeMode, toggleThemeMode } = useContext(themeContext);
  const {
    refs: { menuTogglerRef },
  } = useContext(refContext);

  return (
    <header id="top-header" className="main-with-others-grouped-row-container">
      <button
        type="button"
        className="toggler-icon-only"
        id="menu-toggler"
        ref={menuTogglerRef}
        onClick={() => toggleMenuState()}
        title={menuState ? 'Close menu.' : 'Open menu.'}
        aria-haspopup="menu"
        aria-controls="menu"
        aria-expanded={menuState}
      >
        <FontAwesomeIcon icon={menuState ? faXmark : faBars} />
      </button>
      <button
        type="button"
        className="toggler-text-and-icon toggler-transition"
        id="theme-toggler"
        onClick={() => toggleThemeMode()}
        title={`Switch to ${themeModeData[returnThemeMode(themeMode + 1)].asWord} theme.`}
      >
        <span className={preferenceForDark ? 'moon-color' : 'sun-color'}>
          <FontAwesomeIcon icon={themeModeData[themeMode].icon} />
        </span>
        theme
      </button>
      <h2 id="logo" className="main-item">
        <Link aria-label="Go to the homepage." to="/">
          Checklist
        </Link>
      </h2>
    </header>
  );
};

export default Header;