import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider, HashRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'

import Error from './components/Error';
import Customer from './components/Customer';
import Training from './components/Training';
import CalendarView from './components/CalendarView.jsx';
import Charts from './components/Charts.jsx'

const router = createHashRouter([
  {
    basename: import.meta.env.BASE_URL,
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        element: <Customer />,
        index: true
      },
      {
        path: "training",
        element: <Training />
      },
      {
        path: "calendar",
        element: <CalendarView />
      },
      {
        path: "charts",
        element: <Charts />
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
