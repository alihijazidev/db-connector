import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider, createTheme } from '@mantine/core';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ConnectionProvider } from "@/context/ConnectionContext";
import QueryBuilderPage from "./pages/QueryBuilderPage";

import '@mantine/core/styles.css';
import "./globals.css";

const queryClient = new QueryClient();

const theme = createTheme({
  primaryColor: 'indigo',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  defaultRadius: 'xl',
  colors: {
    // Customization if needed
  },
});

const App = () => (
  <MantineProvider theme={theme} defaultColorScheme="light">
    <div dir="rtl" className="min-h-screen bg-background antialiased">
      <QueryClientProvider client={queryClient}>
        <Sonner position="top-center" richColors />
        <ConnectionProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/query/:connectionId" element={<QueryBuilderPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ConnectionProvider>
      </QueryClientProvider>
    </div>
  </MantineProvider>
);

export default App;