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
    <div className="relative w-80 h-60 p-2 bg-stone-950 border border-white border-opacity-10 flex flex-col justify-end items-start">
      {/* Content container for name, followers, and follow button */}
      <div className="px-4 pt-4 flex-1 z-10">
        <div className="flex items-center gap-1">
          <span className="text-white text-xl font-bold">{agent.name}</span>
          <CheckBadgeIcon className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="text-white text-opacity-60">{followers} Followers</div>
      </div>

      {/* Follow Button */}
      <Link href={`/agent/${agent.id}`} passHref>
        <a className="btn btn-neutral btn-xs mb-2 mr-2 self-end z-10">FOLLOW</a>
      </Link>

      {/* Absolute positioned Profile Image at the bottom left */}
      <div className="absolute bottom-2 left-2 w-14 h-14">
        <Image src={agent.profile} alt="Agent Profile" layout="fill" objectFit="cover" className="bg-neutral-900" />
      </div>
    </div>
  );
};

export default AgentCard;
