import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartProvider>
        <Toaster position="top-center" richColors closeButton /> 
        <AppRouter />
      </CartProvider>
    </BrowserRouter>
  );
}