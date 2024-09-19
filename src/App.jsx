import './App.css';
import { createHashRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

// layouts
import RootLayout from './layouts/RootLayout';

// components
import Checklist from './components/Checklist';
import Home from './components/Home';
import { VisualizerLayout, AllYearsVisualizer, YearVisualizer, MonthVisualizer } from './components/Visualizer';

// TODO: don't use hash router; used to allow refreshing
const router = createHashRouter(createRoutesFromElements(
  <Route path="/" element={<RootLayout />}>
    <Route index element={<Home />} />
    <Route path="all" element={<VisualizerLayout />}>
      <Route index element={<AllYearsVisualizer />} />
      <Route path=":year" element={<YearVisualizer />} />
      <Route path=":year/:month" element={<MonthVisualizer />} />
    </Route>
    <Route path=":year/:month/:day" element={<Checklist />} />
    <Route path="*" element={<Home />} />
  </Route>
));
// since hash router parses location.hash, base is always relative to the place of index.html
// so, hosting from subdirectories won't cause problems

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
