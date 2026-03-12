import { Provider } from "@/components/ui/provider";
import ReactDOM from "react-dom/client";
import App from "./App";
ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider>
      <App />
    </Provider>
);