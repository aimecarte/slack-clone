import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export default function Page() {
  const [activeItem, setActiveItem] = useState("Users");
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = JSON.parse(localStorage.getItem("headers"));
  const users = fetchUsers();
  const channels = fetchUserChannels();

  async function fetchUsers() {
    const response = await fetch("https://slack-api.replit.app/api/v1/users", {
      headers: {
        "Content-type": "application/json",
        ...headers,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async function fetchUserChannels() {
    const response = await fetch("https://slack-api.replit.app/api/v1/channels", {
      headers: {
        "Content-type": "application/json",
        ...headers
      }
    })
    const data = await response.json();
    console.log(data);
    return data
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "350px",
      }}
    >
      <AppSidebar
        user={user}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <h1>{user.email}</h1>
        </header>
        <ScrollArea className="p-4 flex-grow"></ScrollArea>

        <div className="flex gap-2 p-4 pt-0">
          <Input />
          <Button>Send</Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
