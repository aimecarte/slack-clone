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
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [activeItem, setActiveItem] = useState("Users");
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = JSON.parse(localStorage.getItem("headers"));
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const endElement = useRef(null);
  const [id, setId] = useState(null);
  const [name, setName] = useState(user.email);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("https://slack-api.replit.app/api/v1/users", {
          headers: {
            "Content-type": "application/json",
            ...headers,
          },
        });
        const data = await response.json();
        setUsers(data); 
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    async function fetchUserChannels() {
      try {
        const response = await fetch("https://slack-api.replit.app/api/v1/channels", {
          headers: {
            "Content-type": "application/json",
            ...headers,
          },
        });
        const data = await response.json();
        setChannels(data); 
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    }

    fetchUsers();
    fetchUserChannels();
  }, []);

  useEffect(() => {
    if(id){
      const type = activeItem === "Users" ? "User" : "Channel"
      const api = `https://slack-api.replit.app/api/v1/messages?receiver_id=${id}&receiver_class=${type}`

      async function fetchMessages() {
        try {
          const response = await fetch(api, {
            headers: {
              "Content-type": "application/json",
              ...headers,
            },
          });
          const data = await response.json();
          setMessages(data.data); 
        } catch (error) {
          console.error("Error fetching channels:", error);
        }
      }

      if(activeItem === "Users"){
        const userName = users.data.find(user => user.id === id).email;
        setName(userName);
      }

      if(activeItem === "Channels"){
        const channelName = channels.data.find(channel => channel.id === id).name;
        setName(channelName);
      }

      fetchMessages();
    }
  }, [id])

  useEffect(() => {
    if (endElement.current) {
      endElement.current.scrollIntoView();
    }
    
  }, [messages])

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
        users={users}
        channels={channels}
        setId={setId}
        id={id}
      />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <h1>{name}</h1>
        </header>
        <ScrollArea className="p-4 flex-grow">
          <div className="flex flex-col">
            {messages.map((message) => (
              <div key={message.id} className={`${message.sender.id === user.id ? 
                "self-end text-right" : "self-start"}`
              }>
                <span className="text-sm">{message.sender.uid}</span>
                <div className="rounded-md bg-slate-600 text-white mb-4 p-2 w-max">{message.body}</div>
              </div>
            ))}
            <div ref={endElement}></div>
          </div>
        </ScrollArea>

        <div className="flex gap-4 p-4 pt-0">
          <Input />
          <Button>Send</Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
