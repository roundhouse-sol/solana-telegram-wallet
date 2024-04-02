import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Wallet from "./pages/Wallet";
import { WebAppProvider } from "@vkruglikov/react-telegram-web-app";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/wallet/:id",
    element: <Wallet />,
  },
]);

const App = () => {
  return (
    <WebAppProvider
      options={{
        smoothButtonsTransition: true,
      }}
    >
      <RouterProvider router={router} />
    </WebAppProvider>
  );
};

export default App;