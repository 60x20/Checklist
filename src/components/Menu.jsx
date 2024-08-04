import { Link, useNavigate } from "react-router-dom";
import { menuStateContext } from "../layouts/RootLayout";
import { useContext } from "react";

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
          defaultValue="2020-1-1"
          max="2100-12-31"
        />
      </label>
      <p><Link to={dateOfToday.YMD.replaceAll('-', '/')}>today: {dateOfToday.DMY}</Link></p>
      <p>all</p>
    </aside>
    ) : false }
    </>
  );
};


const dateOfToday = returnCurrentDate();

export default Menu;