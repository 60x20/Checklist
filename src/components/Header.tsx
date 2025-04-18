import { Link } from 'react-router-dom';

// context providers
import { useMenuStateContext } from '../providers/MenuStateProvider';
import { useThemeContext } from '../providers/ThemeProvider';
import { useRefContext } from '../providers/RefProvider';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

// helpers
import { returnThemeMode, themeModeData } from '../helpers/themeHelpers';

export default function Header() {
  const { menuState, toggleMenuState } = useMenuStateContext();
  const { preferenceForDark, themeMode, toggleThemeMode } = useThemeContext();
  const {
    refs: { menuTogglerRef },
  } = useRefContext();

  return (
    <header id="top-header" className="main-with-others-grouped-row-container">
      <button
        type="button"
        className="toggler-icon-only"
        id="menu-toggler"
        ref={menuTogglerRef}
        onClick={() => {
          toggleMenuState();
        }}
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
        onClick={() => {
          toggleThemeMode();
        }}
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
}
