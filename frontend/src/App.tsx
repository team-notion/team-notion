import { RouterProvider } from "react-router";
import { Toaster, toast } from 'sonner';
import routes from "./routes";
import { AuthProvider } from "./components/lib/authContext";

const App = () => {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={routes} />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </>
  );
};

export default App;
