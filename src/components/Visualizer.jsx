import { Link, Outlet, useParams } from "react-router-dom";
export const VisualizerLayout = () => {
  return (
    <div id="visualizer">
      <Outlet />
    </div>
  );
}
