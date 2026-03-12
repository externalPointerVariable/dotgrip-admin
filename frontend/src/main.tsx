import { Provider } from "@/components/ui/provider";
import ReactDOM from "react-dom/client";
import App from "./App";
import LoginPage from "./pages/Login";

let content;
let isAuthenticated = localStorage.getItem("authToken") !== null; 
if (isAuthenticated) {
  content = <App />;
} else {
  content = <LoginPage />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider>
      {content}
    </Provider>
);