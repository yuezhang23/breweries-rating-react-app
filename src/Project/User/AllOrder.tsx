import { useSelector } from "react-redux";
import { ProjectState } from "../store";

function AllOrder() {

  const { currentUser } = useSelector((state: ProjectState) => state.userReducer.currentUser);
  
  return (
    <div className="container-fluid">
      Temp Orders
    </div>
  );
}

export default AllOrder;