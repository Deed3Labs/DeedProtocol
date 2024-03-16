import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { AgentModel } from "~~/models/agent.model";

interface Props {
  agent: AgentModel;
}

const AgentCard = ({ agent }: Props) => {
  const followers = useMemo(() => {
    if (!agent) return undefined;
    if (agent.followers >= 1000) {
      return (agent.followers / 1000).toFixed(1) + "K";
    }
    return agent.followers.toString();
  }, [agent?.followers]);

  return (
    <div className="w-80 h-60 p-2 bg-stone-950 border border-white border-opacity-10 flex flex-row justify-start items-center gap-4">
      <div className="w-14 h-14 relative flex-shrink-0">
        <Image src={agent.profile} alt="Agent Profile" layout="fill" objectFit="cover" className="" />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{agent.name}</span>
          <CheckBadgeIcon className="w-5 h-5 text-yellow-400" />
        </div>
        <span className="text-secondary-content">{followers} Followers</span>
        <Link href={`/agent/${agent.id}`} passHref>
          <a className="btn btn-neutral btn-xs mt-2">
            Follow
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AgentCard;

