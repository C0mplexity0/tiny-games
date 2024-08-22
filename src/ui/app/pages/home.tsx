import { Game } from "@/games/games";
import { devices, games } from "@app/App";
import { Button } from "@components/ui/button";
import DeviceButton from "@components/ui/devices/device-button";
import BrowserLink from "@components/util/browser-link";
import { SiFacebook, SiGithub, SiPatreon, SiReddit, SiReplit, SiTumblr, SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import { Folder, Gamepad2, Link, Play, RefreshCcw } from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";


let currentGame: Game;
let setCurrentGame: (currentGame: Game) => void;


const SOCIAL_ICONS: { [social: string]: ReactNode } = {
  "github.com": <SiGithub size="16px" />,
  "youtube.com": <SiYoutube size="16px" />,
  "twitter.com": <SiX size="16px" />,
  "x.com": <SiX size="16px" />,
  "replit.com": <SiReplit size="16px" />,
  "facebook.com": <SiFacebook size="16px" />,
  "tumblr.com": <SiTumblr size="16px" />,
  "reddit.com": <SiReddit size="16px" />,
  "patreon.com": <SiPatreon size="16px" />
}


function Sidebar() {
  return (
    <div className="w-16 h-full border-r p-2">
      <div className="flex flex-col gap-2">
        {
          devices.map((device, i) => <DeviceButton key={i} device={device} />)
        }
        <DeviceButton newButton={true} />
      </div>
      <div className="flex-1" />
      <div className="flex flex-col">

      </div>
    </div>
  )
}

function GameButton({ game }: { game: Game }) {
  return (
    <Button 
      onClick={() => {
        setCurrentGame(game);
      }}
      variant="outline"
      className={`${game == currentGame ? "bg-secondary" : ""} hover:bg-secondary/90 text-secondary-foreground w-full justify-start h-12 p-2 flex flex-row space-x-3`}
    >
      {
        game.icon ?
        <img src={game.icon} className="size-8 rounded-sm border" /> :
        <div className="size-8 rounded-sm border relative"><Gamepad2 className="size-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
      }
      <h2 className="font-bold inline-block h-8 leading-8 align-middle">{game.name}</h2>
    </Button>
  )
}

function GamesList() {
  return (
    <div className="w-56 md:w-72 lg:w-96 h-full border-r flex flex-col">
      <div className="w-full h-fit border-b p-1 flex flex-row">
        <span className="text-secondary-foreground font-bold flex-1 pl-2 h-6 leading-6 block">Games</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-6 rounded-sm"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage("openGamesDir");
          }}
        ><Folder className="size-4 text-secondary-foreground" /></Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-6 rounded-sm"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage("reloadGames");
          }}
        ><RefreshCcw className="size-4 text-secondary-foreground" /></Button>
      </div>
      <div className="p-2 w-full flex-1 flex flex-col gap-2">
        {
          games.map((game, i) => <GameButton game={game} key={i} />)
        }
      </div>
    </div>
  )
}

function getSocialIcon(social: string) {
  const url = new URL(social);
  const icon = SOCIAL_ICONS[url.hostname];

  if (icon) {
    return icon;
  }

  return <Link size="16px" />
}

function SocialButton({ social }: { social: string }) {
  return (
    <Button size="icon" variant="ghost" className="size-9" asChild>
      <BrowserLink to={social}>
        {
          getSocialIcon(social)
        }
      </BrowserLink>
    </Button>
  )
}

function GamePage({ game }: { game: Game }) {
  if (!game) {
    return (
      <div></div>
    )
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
          <div>
            <div className="h-20">
              <h2 className="text-3xl font-bold m-0 p-0">{game.name}</h2>
              {
                game.author ?
                <span className="m-0 p-0 text-secondary-foreground">By {game.author}</span> :
                null
              }
            </div>
            <Button 
              className="w-44 h-10"
              onClick={() => {
                window.electron.ipcRenderer.sendMessage("playGame", games.indexOf(game));
              }}
            ><Play className="mr-2 h-4 w-4" />Play</Button>
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
  )
}


export default function AppHomePage() {
  [currentGame, setCurrentGame] = useState();

  useEffect(() => {
    if (games) {
      setCurrentGame(games[0]);
    }
  }, [games]);

  return (
    <div className="size-full flex flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-row">
        <GamesList />
        <div className="flex-1">
          {
            <GamePage game={currentGame} />
          }
        </div>
      </div>
    </div>
  )
}
