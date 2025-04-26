
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import OpenAIConfig from "../settings/OpenAIConfig";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Cog } from "lucide-react";

const Layout = () => {
  const [openAIConfigOpen, setOpenAIConfigOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <div className="fixed bottom-4 right-4">
        <Dialog open={openAIConfigOpen} onOpenChange={setOpenAIConfigOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <Cog className="h-4 w-4" /> API Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <OpenAIConfig />
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
