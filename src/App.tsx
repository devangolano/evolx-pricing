import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { Toaster } from 'react-hot-toast';
import { toastConfig } from './config/toast';

function App() {
  return (
    <>
      <Toaster toastOptions={toastConfig} />
      <RouterProvider router={router} />
    </>
  );
}

export default App
