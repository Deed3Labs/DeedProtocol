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
    <div className="relative w-80 h-60 p-2 bg-stone-950 border border-white border-opacity-10 flex flex-col justify-between">
      <div className="absolute top-2 left-2">
        <Image src={agent.profile} alt="Agent Profile" width={56} height={56} layout="fixed" className="" />
      </div>
      <div className="pl-20 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{agent.name}</span>
          <CheckBadgeIcon className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="text-secondary-content">{followers} Followers</div>
      </div>
      <Link href={`/agent/${agent.id}`} passHref>
        <a className="self-end btn btn-neutral btn-xs mb-2 mr-2">
          FOLLOW
        </a>
      </Link>
    </div>
  );
};

export default AgentCard;
