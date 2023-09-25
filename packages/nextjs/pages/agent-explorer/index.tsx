import { useEffect, useRef, useState } from "react";
import AgentCard from "./AgentCard";
import FilterBar from "./FilterBar";
import { debounce } from "lodash";
import { uniqueId } from "lodash";
import { NextPage } from "next";
import { AgentModel } from "~~/models/agent.model";

const AgentExplorer: NextPage = () => {
  const [agents, setAgents] = useState<AgentModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [isLast, setIsLast] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMoreAgents();
  }, []);

  useEffect(() => {
    const handleDebouncedScroll = debounce(() => !isLast && handleScroll(), 200);
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

  const loadMoreAgents = () => {
    setCurrentPage(prev => prev + 1);
    for (let index = currentPage * pageSize; index < currentPage * pageSize + pageSize; index++) {
      agents.push({
        id: uniqueId("agent-"),
        name: `Agent ${index}`,
        followers: Math.round(Math.random() * 1000000),
        // Random between image 0 to 78
        profile: `https://randomuser.me/api/portraits/${Math.random() === 1 ? "men" : "women"}/${Math.floor(
          Math.random() * 79,
        )}.jpg`,
        cover: `https://picsum.photos/seed/${Math.random() * 1000}/500/300`,
        email: "random@gmail.com",
        phone: "1234567890",
      });
    }
    if (currentPage === 5) {
      // Fake 5 pages
      setIsLast(true);
    }
    setAgents([...agents]);
  };

  return (
    <div className="container" ref={containerRef}>
      <FilterBar />
      <div className="flex flex-wrap gap-8 items-center justify-center">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
        F
      </div>
    </div>
  );
};

export default AgentExplorer;
