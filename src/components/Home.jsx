import { Link } from "react-router-dom";
import { useContext } from "react";

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";

const Home = () => {
  const currentDate = useContext(currentDateContext);
  
  return (
    <div id="home">
      <h3>Today: <Link to={currentDate.YMD.replaceAll('-', '/')}>{currentDate.DMY}</Link></h3>
    </div>
  );
}
 
export default Home;