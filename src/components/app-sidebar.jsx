import * as React from "react";
import {
  ArchiveX,
  Command,
  File,
  Inbox,
  Send,
  Trash2,
  User,
  Rss,
  Plus,
  PlusCircle,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

// This is sample data

export function AppSidebar({
  user,
  activeItem,
  setActiveItem,
  users,
  channels,
  id,
  setId,
  setMessages,
  setName,
  headers,
  ...props
}) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const { setOpen } = useSidebar();
  const [search, setSearch] = React.useState("");
  const channelNameRef = React.useRef(null);
  const navigate = useNavigate();

  const filteredUsers =
    search.length > 0
      ? users.data?.filter(({ email, id }) => {
          return [email, id].join("").includes(search.toLowerCase());
        })
      : [];

  function handleAddNewChannel() {
    const channelName = channelNameRef.current.value;

    fetch("https://slack-api.replit.app/api/v1/channels", {
      method: "POST",
      body: JSON.stringify({
        name: channelName,
        user_ids: []
      }),
      headers: {
        "Content-type": "application/json",
        ...headers,
      }
    })

    navigate('/')

    console.log("Hello");
  } 

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: "Users",
                      hidden: false,
                    }}
                    onClick={() => {
                      setActiveItem("Users");
                      setSearch("");
                      setId(null);
                      setMessages([]);
                      setName("");
                      setOpen(true);
                    }}
                    isActive={activeItem === "Users"}
                    className="px-2.5 md:px-2"
                  >
                    <User />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: "Channels",
                      hidden: false,
                    }}
                    onClick={() => {
                      setActiveItem("Channels");
                      setSearch("");
                      setId(null);
                      setMessages([]);
                      setName("");
                      setOpen(true);
                    }}
                    isActive={activeItem === "Channels"}
                    className="px-2.5 md:px-2"
                  >
                    <Rss />
                    <span>Channels</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem}
            </div>
          </div>
          {/* <SidebarInput placeholder="Type to search..." /> */}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID"
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {activeItem === "Channels"  && (
                <>
                <Dialog>
                  <DialogTrigger asChild><Button className="w-full">Create a new channel</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a channel</DialogTitle>
                      <DialogDescription>
                        Enter the name of your new channel
                      </DialogDescription>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="channelName" className="text-right">
                            Name
                          </Label>
                          <Input id="channelName" ref={channelNameRef} className="col-span-3" />
                        </div>
                      </div>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddNewChannel}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                  
                  {channels.data?.map((channel) => (
                  <a
                    href="#"
                    key={channel.id}
                    className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    onClick={() => {
                      setId(channel.id);
                      setActiveItem("Channels");
                    }}
                  >
                    <div className="flex w-full items-center gap-2">
                      <span>{channel.name}</span>{" "}
                      <span className="ml-auto text-xs"></span>
                    </div>
                  </a>
                  ))}
                </>
              )
                }
              {(activeItem === "Users" || search.length > 0) &&
                  filteredUsers?.map((user) => (
                    <a
                      href="#"
                      key={user.id}
                      className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      onClick={() => {
                        setId(user.id);
                        setActiveItem("Users");
                      }}
                    >
                      <div className="flex w-full items-center gap-2">
                        <span>{user.uid}</span>{" "}
                        <span className="ml-auto text-xs"></span>
                      </div>
                    </a>
                ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
