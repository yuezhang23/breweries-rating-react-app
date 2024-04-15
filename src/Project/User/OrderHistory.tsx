import { useSelector } from "react-redux";
import { ProjectState } from "../store";

function OrderHistory() {

  const { currentUser } = useSelector((state: ProjectState) => state.userReducer.currentUser);
  
  return (
    <div className="container-fluid">
      Temp Order History
    </div>
  );
}

export default OrderHistory;