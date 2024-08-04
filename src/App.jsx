import './App.css';

import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

// layouts
import RootLayout from './layouts/RootLayout';

// components
import Checklist from './components/Checklist';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={< RootLayout />}>
      <Route path=":year/:month/:day" element={<Checklist />} />
      <Route path="*" />
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
