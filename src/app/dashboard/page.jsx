import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { fetchUserChannels, fetchUsers } from "../../lib/api";


export default function Page() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = JSON.parse(localStorage.getItem("headers"));

  const [activeItem, setActiveItem] = useState("Users");
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userToAdd, setUserToAdd] = useState("");
  const [membersArray, setMembersArray] = useState([]);

  const endElement = useRef(null);

  // async function fetchUsers() {
  //   try {
  //     const response = await fetch(
  //       "https://slack-api.replit.app/api/v1/users",
  //       {
  //         headers: {
  //           "Content-type": "application/json",
  //           ...headers,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     if(data.hasOwnProperty('errors')){
  //         if(data.errors[0] === "You need to sign in or sign up before continuing."){
  //         localStorage.clear();
  //         navigate('/login');
  //       }
  //     }
  //     setUsers(data);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // }

  // async function fetchUserChannels() {
  //   try {
  //     const response = await fetch(
  //       "https://slack-api.replit.app/api/v1/channels",
  //       {
  //         headers: {
  //           "Content-type": "application/json",
  //           ...headers,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     if(data.hasOwnProperty('errors')){
  //       if(data.errors[0] === "You need to sign in or sign up before continuing."){
  //       localStorage.clear();
  //       navigate('/login');
  //     }
  //   }
  //     setChannels(data);
  //   } catch (error) {
  //     console.error("Error fetching channels:", error);
  //   }
  // }

  useEffect(() => {
    if(users.length > 0 || channels.length > 0) {return}

    async function getUserDetails(){
      const x = await fetchUsers();
      const y = await fetchUserChannels();

      // console.log(x, y)
      //       if(x.hasOwnProperty('errors')){
      //     if(x.errors[0] === "You need to sign in or sign up before continuing."){
      //     localStorage.clear();
      //     navigate('/login');
      //   }
      // }
      
      setUsers(x);
      setChannels(y);
    }

    getUserDetails();
  }, [activeItem]);

  useEffect(() => {
    if(users.length > 0 || channels.length > 0) {return}

    async function getUserDetails(){
      const x = await fetchUsers();
      const y = await fetchUserChannels();
      
      setUsers(x);
      setChannels(y);
    }

    getUserDetails();
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
          if(data.hasOwnProperty('errors')){
            if(data.errors[0] === "You need to sign in or sign up before continuing."){
            localStorage.clear();
            navigate('/login');
          }
        }
          setMessages(data.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }

      async function fetchMembersArray() {
        const response = await fetch(
          `https://slack-api.replit.app/api/v1/channels/${id}`,
          {
            headers: {
              "Content-type": "application/json",
              ...headers,
            },
          }
        );
        const data = await response.json();
        if(data.hasOwnProperty('errors')){
          if(data.errors[0] === "You need to sign in or sign up before continuing."){
          localStorage.clear();
          navigate('/login');
        }
      }
        const memArray = data.data["channel_members"].map(
          (member) => member.user_id
        );
        const memArrayData = users.data.filter((user) =>
          memArray.includes(user.id)
        );
        setMembersArray(memArrayData);
      }

      fetchMessages();
      const interval = setInterval(fetchMessages, 100000);

      if (activeItem === "Users") {
        const userName = users.data.find((user) => user.id === id).email;
        setName(userName);
      }

      if (activeItem === "Channels") {
        const channelName = channels.data.find(
          (channel) => channel.id === id
        ).name;
        setName(channelName);
        fetchMembersArray();
      }
      return () => clearInterval(interval);
    }
  }, [id]);

  useEffect(() => {
    if (endElement.current) {
      endElement.current.scrollIntoView();
    }
  }, [messages]);

  async function handleSend() {
    if (id === null || message === "") {
      return;
    }

    const requestBody = {
      receiver_id: id,
      receiver_class: activeItem === "Users" ? "User" : "Channel",
      body: message,
    };

    try {
      const response = await fetch(
        "https://slack-api.replit.app/api/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            ...headers,
          },
          body: JSON.stringify(requestBody),
        }
      );
      const data = await response.json();
      if(data.hasOwnProperty('errors')){
        if(data.errors[0] === "You need to sign in or sign up before continuing."){
        localStorage.clear();
        navigate('/login');
      }
    }
      console.log(data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  

  async function handleAddUser() {
    const numMembersArray = membersArray.map((u) => u.id);
    const canBeAdded =
      !numMembersArray.includes(Number(userToAdd)) &&
      Boolean(users.data.find((user) => user.id === Number(userToAdd)));

    if (canBeAdded) {
      const data = await fetch("https://slack-api.replit.app/api/v1/channel/add_member", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          id,
          member_id: userToAdd,
        }),
      });

      if(data.hasOwnProperty('errors')){
          if(data.errors[0] === "You need to sign in or sign up before continuing."){
          localStorage.clear();
          navigate('/login');
        }
      }

      setMessage("");
    } else {
      console.log("invalid user");
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
        setMessages={setMessages}
        setName={setName}
        headers={headers}
      />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <h1>{name || "Select a user or channel"}</h1>
          {activeItem === "Channels" && id !== null && (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="ml-auto p-4">
                    <Plus />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add a new member</SheetTitle>
                    <SheetDescription>
                      Enter the user id to add to this channel
                    </SheetDescription>
                    <div className="flex flex-col mt-4">
                      <div className="grid grid-cols-4 items-center gap-4 mb-4">
                        <Label htmlFor="userID">
                          User ID
                        </Label>
                        <Input
                          id="userID"
                          value={userToAdd}
                          onChange={(e) => setUserToAdd(e.target.value)}
                          className="col-span-3"
                          type="number"
                        />
                      </div>
                      <h1 className="font-bold mb-1">Channel Members</h1>
                      <ScrollArea className="h-[200px] mb-4">
                        <div className="flex flex-col">
                          {membersArray.map((user) => (
                            <div key={user.id}>{user.email}</div>
                          ))}
                        </div>
                      </ScrollArea>
                      <SheetClose asChild>
                        <Button type="submit" onClick={handleAddUser}>
                          Add
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </>
          )}
        </header>
        <ScrollArea className="p-4 flex-grow">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender.id === user.id
                    ? "self-end items-end"
                    : "self-start"
                }`}
              >
                <span className="text-sm">{message.sender.uid}</span>
                <div className="rounded-md bg-slate-600 text-white px-2 py-1 w-max max-w-[300px] break-words">
                  {message.body}
                </div>
                <span className="text-xs text-slate-500">{moment(message.created_at).fromNow()}</span>
              </div>
            ))}
            <div ref={endElement}></div>
          </div>
        </ScrollArea>

        <div className="flex gap-4 p-4 pt-0">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button
            onClick={() => {
              handleSend();
              setMessage("");
            }}
          >
            Send
          </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
