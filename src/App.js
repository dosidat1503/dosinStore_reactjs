import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Suspense } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import GlobalStyles from "./components/GlobalStyles/GlobalStyles";
import { Loading } from "./components/ui";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={Loading}>
        <GlobalStyles>
          <AppRoutes />
        </GlobalStyles>
      </Suspense>
    </BrowserRouter>
  );
}
export default App;
