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
    <div className="w-full h-60 p-2 bg-stone-950 border border-white border-opacity-10 flex-col justify-start items-start inline-flex">
      <div className="self-stretch h-36 bg-neutral-900 flex-col justify-end items-start flex">
        <div className="h-14 p-0.5 border border-white border-opacity-10 flex justify-center items-center">
          <Image src={agent.profile} alt="Agent Profile" height={56} width={56} layout="fixed" className="" />
          <CheckBadgeIcon className="absolute text-yellow-400 w-5 h-5" style={{ right: '1.25rem', bottom: '0.125rem' }} />
        </div>
      </div>
      <div className="self-stretch px-4 pt-7 pb-2.5 justify-start items-center gap-4 inline-flex">
        <div className="flex-col justify-start items-start">
          <div className="text-white text-xs font-bold font-['Montserrat']">{agent.name}</div>
          <div className="text-white text-opacity-60 text-xs font-medium font-['Montserrat']">{agent.location}</div>
          <div className="text-white text-opacity-60 text-xs font-medium font-['Montserrat']">{followers} Followers</div>
        </div>
        <Link href={`/agent/${agent.id}`} passHref>
          <a className="btn btn-neutral btn-xs self-stretch flex justify-center items-center">
            FOLLOW
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AgentCard;
