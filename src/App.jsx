import './App.css'
import './index.css'

import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div className="background">
        <h1 className="headers">Personal Trainer</h1>
        <nav className="headers">
          <Link className="links" to={"/"}>Customers</Link>
          <Link className="links"to="/training">Training</Link>
          <Link className="links"to="/calendar">Calendar</Link>
          <Link className="links"to="/charts">Charts</Link>
        </nav>
      </div>
      <Outlet />

    </>
  );
}

export default App;
