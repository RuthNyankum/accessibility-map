import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AccessibilityProvider>
          <AppRoutes />
        </AccessibilityProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
