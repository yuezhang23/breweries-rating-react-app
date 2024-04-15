import { useSelector } from "react-redux";
import { ProjectState } from "../store";

function Menu() {

  const { currentUser } = useSelector((state: ProjectState) => state.userReducer.currentUser);
  
  return (
    <div className="container-fluid">
      Temp Menu
    </div>
  );
}

export default Menu;