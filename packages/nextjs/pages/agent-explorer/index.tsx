import { useEffect, useRef, useState } from "react";
import AgentCard from "../../components/AgentCard";
import AgentFilters from "../../components/AgentFilters";
import { debounce } from "lodash";
import { NextPage } from "next";
import { AgentModel } from "~~/models/agent.model";
import { MapIconModel } from "~~/models/map-icon.model";
import { sleepAsync } from "~~/utils/sleepAsync";

const agentIcon: MapIconModel = {
  className: "agent-icon",
  html: `<div class="marker-pin"></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
   <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
 </svg>
 `,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [-3, -76],
};

const AgentExplorer: NextPage = () => {
  const [agents, setAgents] = useState<AgentModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!agents.length) {
      loadMoreAgents();
    }
  }, []);

  useEffect(() => {
    const handleDebouncedScroll = debounce(() => !isLast && handleScroll(), 100);
    window.addEventListener("scroll", handleDebouncedScroll);
    return () => {
      window.removeEventListener("scroll", handleDebouncedScroll);
    };
  }, [isLast]);

  const handleScroll = () => {
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      if (bottom <= innerHeight) {
        loadMoreAgents();
      }
    }
  };

  const onFilter = (_filter?: { search?: string }) => {
    setCurrentPage(0);
    setAgents([]);
    loadMoreAgents();
  };

  const loadMoreAgents = async () => {
    setLoading(true);
    await sleepAsync(500);
    setCurrentPage(prev => prev + 1);
    const radius = 10;
    const center = { lat: 40, lng: -100 };
    for (let index = currentPage * pageSize; index < currentPage * pageSize + pageSize; index++) {
      const newAgent: AgentModel = {
        id: index.toString(),
        name: `Agent ${index + 1}`,
        address: "address.eth",
        followers: Math.round(Math.random() * 10000),
        // Random between image 0 to 78
        profile: `https://randomuser.me/api/portraits/${
          Math.round(Math.random()) === 1 ? "men" : "women"
        }/${Math.floor(Math.random() * 79)}.jpg`,
        cover: `https://picsum.photos/seed/${Math.round(Math.random() * 1000)}/500/300`,
        email: "random@gmail.com",
        phone: "1234567890",
        lat: center.lat + (Math.random() - 0.5) * (radius * 2),
        lng: center.lng + (Math.random() - 0.5) * (radius * 2),
        icon: agentIcon,
        type: "fixme",
        location: "New York",
      };
      newAgent.popupContent = <AgentCard agent={newAgent} />;
      agents.push(newAgent);
    }
    if (currentPage === 5) {
      // Fake 5 pages
      setIsLast(true);
    }
    setAgents([...agents]);
    setLoading(false);
  };

  return (
    <div className="container" ref={containerRef}>
      <AgentFilters onFilter={onFilter} agents={agents} />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5 sm:gap-3 items-start justify-start w-full">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
      {loading && <span className="loading loading-bars loading-lg my-8" />}
    </div>
  );
};

export default AgentExplorer;
