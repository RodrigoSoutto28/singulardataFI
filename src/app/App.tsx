import { Suspense } from "react";
import { Providers } from "./providers";
import { AppRoutes } from "./routes";
import { PageLoader } from "@/shared/components/ui/page-loader";
import "@/shared/lib/toast"; // This was in src/lib/toast.ts, moved to shared/lib/
import "@/styles/index.css";

const App = () => (
  <Providers>
    <Suspense fallback={<PageLoader />}>
      <AppRoutes />
    </Suspense>
  </Providers>
);

export default App;
