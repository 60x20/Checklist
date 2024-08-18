import './App.css';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

// layouts
import RootLayout from './layouts/RootLayout';

// components
import Checklist from './components/Checklist';
import { VisualizerLayout, AllYearsVisualizer, YearVisualizer, MonthVisualizer } from './components/Visualizer';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="all" element={<VisualizerLayout />}>
        <Route index element={<AllYearsVisualizer />} />
        <Route path=":year" element={<YearVisualizer />} />
        <Route path=":year/:month" element={<MonthVisualizer />} />
      </Route>
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
