import './App.css';

import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

// layouts
import RootLayout from './layouts/RootLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={< RootLayout />}>
      <Route path=":year/:month/:day" element={<h1 style={{'text-align': 'end'}}>1222</h1>} />
      <Route path="*" />
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
