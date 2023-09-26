import { useEffect, useRef, useState } from "react";
import AgentCard from "./AgentCard";
import AgentFilters from "./AgentFilters";
import { debounce } from "lodash";
import { uniqueId } from "lodash";
import { NextPage } from "next";
import { AgentModel } from "~~/models/agent.model";
import { sleepAsync } from "~~/utils/sleepAsync";

const AgentExplorer: NextPage = () => {
  const [agents, setAgents] = useState<AgentModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMoreAgents();
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
    for (let index = currentPage * pageSize; index < currentPage * pageSize + pageSize; index++) {
      agents.push({
        id: uniqueId("agent-"),
        name: `Agent ${index}`,
        address: "address.eth",
        followers: Math.round(Math.random() * 10000),
        // Random between image 0 to 78
        profile: `https://randomuser.me/api/portraits/${Math.round(Math.random()) === 1 ? "men" : "women"}/${Math.floor(
          Math.random() * 79,
        )}.jpg`,
        cover: `https://picsum.photos/seed/${Math.round(Math.random() * 1000)}/500/300`,
        email: "random@gmail.com",
        phone: "1234567890",
      });
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
      <AgentFilters onFilter={onFilter} />
      <div className="flex flex-wrap gap-2 lg:gap-8 items-center justify-center max-w-full">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
      {loading && <span className="loading loading-bars loading-lg my-8"></span>}
    </div>
  );
};

export default AgentExplorer;
