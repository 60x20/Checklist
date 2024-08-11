import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// contexts
import { menuStateContext } from '../providers/MenuStateProvider';
import { currentDateContext } from '../providers/CurrentDateProvider';

const Menu = () => {
  const navigate = useNavigate();
  function goToRequestedDateHandler(e) {
    const requestedDate = e.currentTarget.value;
    // requestedDate might be an empty string in case it's an invalid date
    if (requestedDate) {
      navigate(requestedDate.replaceAll('-', '/'));
    }
  }

  const { menuState } = useContext(menuStateContext);
  const currentDate = useContext(currentDateContext);

  return (
    <>
    { menuState ? (
    <aside role="menu" id="menu">
      <h2>Previous Checklists</h2>
      {/* get previous checklists */}
      {[
        <p key={1}>checklist3</p>,
        <p key={2}>checklist2</p>,
        <p key={3}>checklist1</p>
      ]}
      <label>
        <span>go to: </span>
        <input 
          onChange={goToRequestedDateHandler}
          type="date"
          min="2000-01-01"
          defaultValue={currentDate.YMD}
          max="2100-12-31"
        />
      </label>
      <p><Link to={currentDate.YMD.replaceAll('-', '/')}>today: {currentDate.DMY}</Link></p>
      <p>all</p>
    </aside>
    ) : false }
    </>
  );
};

export default Menu;