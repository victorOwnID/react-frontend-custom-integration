import React from 'react';
import { parseJWT, removeUserSession } from './Utils/Common';

function Dashboard(props) {

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/login');
  }

  var userUID = parseJWT(localStorage.getItem("token"));

  return (
    <div>
      Welcome {userUID}!<br /><br />
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default Dashboard;
