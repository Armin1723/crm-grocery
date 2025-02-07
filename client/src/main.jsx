import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import ErrorBoundary from "./ErrorBoundary.jsx";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ErrorBoundary>
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </Provider>
);
