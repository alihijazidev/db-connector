import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider, createTheme } from '@mantine/core';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ConnectionProvider } from "@/context/ConnectionContext";
import QueryBuilderPage from "./pages/QueryBuilderPage";
import '@mantine/core/styles.css';
import "./App.css";

const queryClient = new QueryClient();

const theme = createTheme({
  primaryColor: 'indigo',
  fontFamily: 'Inter, system-ui, sans-serif',
  defaultRadius: 'xl',
});

const App = () => (
  <MantineProvider theme={theme} defaultColorScheme="light">
    <div dir="rtl" className="font-sans min-h-screen bg-background antialiased">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <ConnectionProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/query/:connectionId" element={<QueryBuilderPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ConnectionProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  </MantineProvider>
);

export default App;