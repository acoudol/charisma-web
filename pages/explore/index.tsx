import Image from "next/image"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Button } from "@components/ui/button"
import { Separator } from "@components/ui/separator"
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area"
import Page from "@components/page"
import { SkipNavContent } from "@reach/skip-nav"
import Layout from "@components/layout/layout"
import { GetStaticProps } from "next"
import { getInteractionUri } from "@lib/stacks-api"
import { cn } from "@lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@components/ui/context-menu"
import { useRouter } from "next/navigation"

export type Collection = (typeof collections)[number]

export const collections = [
  "Charisma Picks",
  "Recently Added",
  "Interactions",
]

export interface Interaction {
  name: string;
  artist: string;
  cover: string;
  type: "interaction";
  uri: string | null;
}

const INTERACTIONS = [
  { address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS', name: 'charisma-mine-rc1' },
  { address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS', name: 'keepers-challenge-rc3' },
  { address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS', name: 'hot-potato-rc1' },
  { address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS', name: 'fatigue-rc1' },
  // Add more interactions here
];

interface ExplorePageProps {
  interactionData: Interaction[];
}

export const getStaticProps: GetStaticProps<ExplorePageProps> = async () => {
  const interactionData = await Promise.all(
    INTERACTIONS.map(async (interaction) => {
      const uri = await getInteractionUri(interaction.address, interaction.name);
      let cover;
      switch (interaction.name) {
        case 'keepers-challenge-rc3':
          cover = "/interactions/keepers-challenge-1.png";
          break;
        case 'charisma-mine-rc1':
          cover = "/interactions/charisma-mine.png";
          break;
        case 'hot-potato-rc1':
          cover = "/interactions/hot-potato.png";
          break;
        case 'fatigue-rc1':
          cover = "/interactions/fatigue.png";
          break;
        default:
          break;
      }
      return {
        name: interaction.name,
        artist: interaction.address,
        cover: cover || "/dmg-logo.gif",
        type: "interaction" as const,
        uri: uri
      };
    })
  );

  return {
    props: {
      interactionData,
    },
    revalidate: 600, // Revalidate every 10 minutes
  };
};

export default function ExplorePage({ interactionData }: ExplorePageProps) {
  const metadata = {
    title: "Explore Charisma",
    description: "Discover and interact with Charisma protocol.",
  }

  const renderInteractionSection = (title: string, description: string, interactions: Interaction[], recent = false) => (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex pb-4 space-x-4">
            {interactions.map((interaction) => (
              <InteractionArtwork
                key={interaction.name}
                interaction={interaction}
                className={recent ? "w-[150px]" : "w-[250px]"}
                aspectRatio="square"
                width={recent ? 150 : 250}
                height={recent ? 150 : 250}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );

  return (
    <Page meta={metadata} fullViewport>
      <SkipNavContent />
      <Layout>
        <div className="md:hidden">
          <Image
            src="/examples/nft-marketplace-light.png"
            width={1280}
            height={1114}
            alt="Charisma Interactions"
            className="block dark:hidden"
          />
          <Image
            src="/examples/nft-marketplace-dark.png"
            width={1280}
            height={1114}
            alt="Charisma Interactions"
            className="hidden dark:block"
          />
        </div>
        <div className="hidden md:block">
          <div className="border-t">
            <div className="">
              <div className="grid lg:grid-cols-5">
                <Sidebar collections={collections} className="hidden lg:block" />
                <div className="col-span-3 lg:col-span-4 lg:border-l">
                  <div className="h-full px-4 py-6 lg:px-8">
                    <Tabs defaultValue="all" className="h-full space-y-6">
                      <div className="flex items-center space-between">
                        <TabsList>
                          <TabsTrigger value="all" className="relative">
                            All
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent
                        value="all"
                        className="p-0 border-none outline-none"
                      >
                        {renderInteractionSection(
                          "Explore Charisma",
                          "Discover and interact with the Charisma protocol.",
                          interactionData
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Page>
  )
}

interface InteractionArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  interaction: Interaction
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

function InteractionArtwork({
  interaction,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: InteractionArtworkProps) {
  const router = useRouter();

  const handleInteractionClick = () => {
    if (interaction.uri) {
      router.push(interaction.uri);
    } else {
      console.error('No URI available for this interaction');
    }
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="overflow-hidden rounded-md cursor-pointer"
            onClick={handleInteractionClick}
          >
            <Image
              src={interaction.cover}
              alt={interaction.name}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all opacity-90 hover:opacity-100",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem onClick={handleInteractionClick}>Explore Interaction</ContextMenuItem>
          <ContextMenuItem>View Details</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{interaction.name}</h3>
        <p className="text-muted-foreground">
          {interaction.artist.slice(0, 4)}...{interaction.artist.slice(-4)}
        </p>
      </div>
    </div>
  )
}

function InteractionEmptyPlaceholder() {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="w-10 h-10 text-muted-foreground"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>

        <h3 className="mt-4 text-lg font-semibold">No Interactions found</h3>
        <p className="mt-2 mb-4 text-sm text-muted-foreground">
          No interactions are currently available. Check back later!
        </p>
      </div>
    </div>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collections: Collection[]
}

function Sidebar({ className, collections }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            Explore
          </h2>
          <div className="space-y-1">
            <Button variant="outline" className="justify-start w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Discover
            </Button>
            <Button disabled variant="ghost" className="justify-start w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
              </svg>
              Popular Interactions
            </Button>
            <Button disabled variant="ghost" className="justify-start w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Categories
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            My Interactions
          </h2>
          <div className="space-y-1">
            <Button disabled variant="ghost" className="justify-start w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Recent
            </Button>
            <Button disabled variant="ghost" className="justify-start w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Favorited
            </Button>
            <Button disabled variant="ghost" className="justify-start w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              History
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative text-lg font-semibold tracking-tight px-7">
            Collections
          </h2>
          <ScrollArea className="h-full px-1">
            <div className="p-2 space-y-1">
              {collections?.map((collection, i) => (
                <Button
                  key={`${collection}-${i}`}
                  variant="ghost"
                  className="justify-start w-full font-normal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  {collection}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export { InteractionArtwork, InteractionEmptyPlaceholder, Sidebar };