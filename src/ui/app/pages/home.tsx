import { Game } from "@/games/games";
import { devices, games, gamesOrder } from "@app/App";
import { Button, ButtonWithDropdown, ButtonWithDropdownContainer, DropdownButton } from "@components/ui/button";
import { DeviceButtonPopoverContent } from "@components/ui/devices/device-button";
import { Content, DraggableArea, TitleBar } from "@components/ui/pages/page-structure";
import { SiBuymeacoffee, SiFacebook, SiGithub, SiKofi, SiMastodon, SiPatreon, SiReddit, SiReplit, SiThreads, SiTumblr, SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@components/ui/tooltip";
import { ArrowDownWideNarrow, CircleUserRound, Folder, Gamepad2, Link, Play, Plus, RefreshCcw, Terminal } from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuTrigger } from "@components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuItem } from "@components/ui/dropdown-menu";
import { openLinkInBrowser } from "@app/utils";
import { TinyGamesSymbol } from "@components/ui/branding/icons";
import { ReconnectingAnimation } from "@components/ui/devices/profile";
import { Device } from "@/devices/devices";
import { Popover, PopoverTrigger } from "@components/ui/popover";
import * as ReactRouterDom from "react-router-dom";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";


let currentGame: Game;
let setCurrentGame: (currentGame: Game) => void;


const SOCIAL_ICONS: { [social: string]: { icon: ReactNode, name: string } } = {
  "github.com": {
    icon: <SiGithub title="" size="16px" />,
    name: "GitHub"
  },
  "youtube.com": {
    icon: <SiYoutube title="" size="16px" />,
    name: "YouTube"
  },
  "twitter.com": {
    icon: <SiX title="" size="16px" />,
    name: "X / Twitter"
  },
  "x.com": {
    icon: <SiX title="" size="16px" />,
    name: "X / Twitter"
  },
  "mastodon.social": {
    icon: <SiMastodon title="" size="16px" />,
    name: "Mastodon"
  },
  "replit.com": {
    icon: <SiReplit title="" size="16px" />,
    name: "Replit"
  },
  "facebook.com": {
    icon: <SiFacebook title="" size="16px" />,
    name: "Facebook"
  },
  "threads.net": {
    icon: <SiThreads title="" size="16px" />,
    name: "Threads"
  },
  "tumblr.com": {
    icon: <SiTumblr title="" size="16px" />,
    name: "Tumblr"
  },
  "reddit.com": {
    icon: <SiReddit title="" size="16px" />,
    name: "Reddit"
  },
  "patreon.com": {
    icon: <SiPatreon title="" size="16px" />,
    name: "Patreon"
  },
  "buymeacoffee.com": {
    icon: <SiBuymeacoffee title="" size="16px" />,
    name: "Buy Me a Coffee"
  },
  "ko-fi.com": {
    icon: <SiKofi title="" size="16px" />,
    name: "Ko-fi"
  },
};

function GameButton({ game }: { game: Game }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button 
          onClick={() => {
            setCurrentGame(game);
          }}
          variant="ghost"
          className={`${game == currentGame ? "bg-secondary-background" : ""} hover:bg-secondary-background/90 text-secondary-foreground w-full justify-start h-10 p-2 flex flex-row space-x-3`}
        >
          {
            game.icon ?
            <img src={game.icon} className="size-7 rounded-sm" /> :
            <div className="size-7 rounded-sm border relative"><Gamepad2 className="size-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
          }
          <h2 className="font-bold inline-block h-8 leading-8 align-middle overflow-hidden whitespace-nowrap text-ellipsis">{game.name}</h2>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          inset
          onClick={() => {
            window.electron.ipcRenderer.sendMessage("playGame", games.indexOf(game));
          }}
        >
          Play Game
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onClick={() => {
            window.electron.ipcRenderer.sendMessage("reloadGames", gamesOrder);
          }}
        >
          Reload Games
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onClick={() => {
            window.electron.ipcRenderer.sendMessage("openGamesDir");
          }}
        >
          Show in File Explorer
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={gamesOrder}>
          <ContextMenuLabel inset>Sort By</ContextMenuLabel>
          <ContextMenuRadioItem
            value="lastPlayed"
            onClick={() => {
              window.electron.ipcRenderer.sendMessage("getGames", "lastPlayed");
            }}
          >
            Last Played
          </ContextMenuRadioItem>
          <ContextMenuRadioItem 
            value="alphabetically"
            onClick={() => {
              window.electron.ipcRenderer.sendMessage("getGames", "alphabetically");
            }}
          >
            Alphabetically
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function GamesList() {
  return (
    <div className="w-56 md:w-72 lg:w-96 h-full border-r flex flex-col">
      <div className="w-full h-fit p-1 flex flex-row justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-6 rounded-sm"
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage("reloadGames", gamesOrder);
                }}
              >
                <RefreshCcw className="size-4 text-secondary-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Reload games</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-6 rounded-sm"
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage("openGamesDir");
                }}
              >
                <Folder className="size-4 text-secondary-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Open games folder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-6 rounded-sm"
                  >
                    <ArrowDownWideNarrow className="size-4 text-secondary-foreground" />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>

              <TooltipContent side="bottom">
                <p>Sort by...</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup value={gamesOrder}>
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>

              <DropdownMenuRadioItem 
                value="lastPlayed"
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage("getGames", "lastPlayed");
                }}
              >Last Played</DropdownMenuRadioItem>

              <DropdownMenuRadioItem 
                value="alphabetically"
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage("getGames", "alphabetically");
                }}
              >Alphabetically</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-2 pt-0 w-full flex-1 flex flex-col gap-2">
        {
          games.map((game, i) => <GameButton game={game} key={i} />)
        }
      </div>
    </div>
  );
}

function getSocialInfo(social: string) {
  const url = new URL(social);
  const icon = SOCIAL_ICONS[url.hostname];

  if (icon) {
    return icon;
  }

  return {icon: <Link size="16px" />, name: url.hostname};
}

function SocialButton({ social }: { social: string }) {
  let socialInfo = getSocialInfo(social);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" className="size-9" onClick={() => openLinkInBrowser(social)}>
            {socialInfo.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {socialInfo.name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function GamePage({ game }: { game: Game }) {
  if (!game) {
    return (
      <div></div>
    );
  }

  return (
    <div className="size-full relative">
      <div 
        className="w-full h-[50vh] bg-center bg-no-repeat bg-cover relative"
        style={{
          backgroundImage: `url(${game.thumbnail})`
        }}
      >
        <div 
          className="w-full h-full absolute bottom-0" 
          style={{
            backgroundImage: "linear-gradient(180deg, hsl(var(--background) / 0%) 0%, hsl(var(--background) / 100%) 90%)"
          }}
        />
      </div>

      <div className="absolute w-full h-fit p-4 left-0 top-[50vh] -translate-y-24 flex flex-col gap-y-4">
        <div className="flex flex-row gap-x-2 mb-4">
          <img src={game.icon} className="rounded-2xl size-32 shadow-lg shadow-stone-900 border" />
          <div className="flex-1 overflow-hidden">
            <div className="h-20">
              <h2 className="text-3xl font-bold m-0 p-0 overflow-hidden whitespace-nowrap text-ellipsis">{game.name}</h2>
              {
                game.author ?
                <span className="m-0 p-0 text-secondary-foreground">By {game.author}</span> :
                null
              }
            </div>
            <div className="flex flex-row gap-2">
              <ButtonWithDropdownContainer>
                <ButtonWithDropdown
                  className="w-44 h-10"
                  onClick={() => {
                    window.electron.ipcRenderer.sendMessage("playGame", games.indexOf(game));
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />Play
                </ButtonWithDropdown>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <DropdownButton />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        window.electron.ipcRenderer.sendMessage("playGame", games.indexOf(game), true);
                      }}
                      className="flex flex-row gap-2"
                    >
                      <Terminal size={20} /> Dev Mode
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ButtonWithDropdownContainer>
            </div>
          </div>
        </div>
        
        {
          game.description ?
          <span className="text-secondary-foreground w-full overflow-hidden text-ellipsis">{game.description}</span> :
          null
        }

        {
          game.socials ?
          <div className="rounded-md p-0 flex flex-row w-fit">
            {
              game.socials.map((social, i) => <SocialButton social={social} key={i} />)
            }
          </div> :
          null
        }
      </div>
    </div>
  );
}

function TitleBarDeviceNewButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="p-0">
          <ReactRouterDom.Link to="/devices/add-devices">
            <Button tabIndex={-1} variant="ghost" size="icon" className="size-8 border-2 rounded-full overflow-hidden relative p-0 bg-element hover:bg-element/90 border-element-border">
              <Plus className="size-4" />
            </Button>
          </ReactRouterDom.Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Connect device</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function TitleBarDeviceButton({ device }: { device: Device }) {
  return (
    <Popover>
      <PopoverTrigger>
        <div title={device.username} style={{borderColor: `hsl(var(--device-${device.colourId}))`}} className="size-8 bg-element hover:bg-element/90 border-2 rounded-full overflow-hidden relative">
          {
            device.connected ?
            device.profileImage ? <img src={device.profileImage} className="size-full object-cover" /> : <CircleUserRound className="text-foreground opacity-60 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2/5" />
            :
            <ReconnectingAnimation />
          }
        </div>
      </PopoverTrigger>

      <DeviceButtonPopoverContent device={device} popoverSide={"bottom"} />
    </Popover>
  );
}

function DeviceList() {
  return (
    <div className="p-1 flex flex-row gap-1 bg-black/15 rounded-full">
      <TitleBarDeviceNewButton />
      {
        devices.map((device, i) => <TitleBarDeviceButton key={i} device={device} />)
      }
    </div>
  );
}

export default function AppHomePage() {
  [currentGame, setCurrentGame] = useState();

  useEffect(() => {
    if (games) {
      setCurrentGame(games[0]);
    }
  }, [games]);

  return (
    <div className="size-full">
      <Helmet>
        <title>Games</title>
      </Helmet>
      <TitleBar className="flex flex-row justify-center items-center">
        <DraggableArea className="size-full flex-1">
          <TinyGamesSymbol className="text-primary m-[0.375rem]" width={38} height={38} />
        </DraggableArea>
        <ScrollArea className="h-10 flex flex-col justify-center pl-2 pr-2">
            <DeviceList />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
      </TitleBar>
      <Content>
        <div className="size-full flex flex-row">
          <div className="flex-1 flex flex-row">
            <GamesList />
            <div className="flex-1">
              {
                <GamePage game={currentGame} />
              }
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
}
