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
import { Plus } from "lucide-react";

export default function Page() {
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = JSON.parse(localStorage.getItem("headers"));

  const [activeItem, setActiveItem] = useState("Users");
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState(user.email);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  
  const endElement = useRef(null);

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
    if (id) {
      const type = activeItem === "Users" ? "User" : "Channel";
      const api = `https://slack-api.replit.app/api/v1/messages?receiver_id=${id}&receiver_class=${type}`;
  
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
          console.error("Error fetching messages:", error);
        }
      }
  
      fetchMessages();
      const interval = setInterval(fetchMessages, 100000);

      if(activeItem === "Users"){
        const userName = users.data.find(user => user.id === id).email;
        setName(userName);
      }

      if(activeItem === "Channels"){
        const channelName = channels.data.find(channel => channel.id === id).name;
        setName(channelName);
      }
      return () => clearInterval(interval);
    }
  }, [id]); 
  

  useEffect(() => {
    if (endElement.current) {
      endElement.current.scrollIntoView();
    }
    
  }, [messages])

  async function handleSend(){
      if(id === null || message === ''){
        return
      }
    
      const requestBody = {
        "receiver_id": id,
        "receiver_class": activeItem === "Users" ? "User" : "Channel",
        "body": message
      }

      console.log(requestBody);
      
      try {
        const response = await fetch("https://slack-api.replit.app/api/v1/messages", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            ...headers,
          },
          body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        console.log(data)
      } catch (error) {
        console.error("Error sending message:", error);
      }
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
        users={users}
        channels={channels}
        setId={setId}
        id={id}
      />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <h1>{name}</h1>
          {(activeItem === "Channels" && id !== null) && <Plus className="ml-auto" />}
        </header>
        <ScrollArea className="p-4 flex-grow">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex flex-col ${message.sender.id === user.id ? 
                "self-end items-end" : "self-start"}`
              }>
                <span className="text-sm">{message.sender.uid}</span>
                <div className="rounded-md bg-slate-600 text-white px-2 py-1 w-max max-w-[300px] break-words">{message.body}</div>
              </div>
            ))}
            <div ref={endElement}></div>
          </div>
        </ScrollArea>

        <div className="flex gap-4 p-4 pt-0">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={() => {
            handleSend();
            setMessage("");
          }}>Send</Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
