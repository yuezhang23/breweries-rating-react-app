import * as client from "./client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setCurrentUser } from "./reducer";

function Logging({ children } : {children: any}) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchUser = async() => {
    const user = await client.profile();
    dispatch(setCurrentUser(user));
    setLoading(false);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {!loading && children}
    </>
  );
}

export default Logging;