import { Routes, Route } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import Nav from './Nav';
import store from './store';
import Home from './Home';
import Search from './Search';
import Signup from './User/Signup';
import Signin from './User/Signin';
import Logging from './User/Logging';
import Profile from './User/Profile';
import OrderHistory from './User/OrderHistory';
import AllOrder from './User/AllOrder';
import UserTable from './User/Table';
import Menu from './Menu';

function Project() {

  return (
    <Provider store={store}>
        <Logging>
          <div className='d-flex flex-column'>
              <Nav />
              <div className='flex-grow-1' style={{ paddingTop: '56px' }}>
                  <Routes>
                      <Route path="/" element={<Navigate to="Home" />} />
                      <Route path="Home" element={<Home />} />
                      <Route path="Search" element={<Search />} />
                      <Route path="Menu" element={<Menu />} />
                      <Route path="User/Signin" element={<Signin />} />
                      <Route path="User/Signup" element={<Signup />} />
                      <Route path="User/Profile" element={<Profile />} />
                      <Route path="User/OrderHistory" element={<OrderHistory />} />
                      <Route path="User/Admin/Users" element={<UserTable />} />
                      <Route path="User/Admin/Orders" element={<AllOrder />} />         
                  </Routes>
              </div>
          </div>
        </Logging>
    </Provider>

    )
}

export default Project;