import { useMemo } from "react";
import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { AgentModel } from "~~/models/agent.model";
import { notification } from "~~/utils/scaffold-eth";

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    notification.info("Copied to clipboard", {
      position: "bottom-right",
    });
  };

  return (
    <div className="w-80 h-60 p-2 bg-stone-950 border border-white border-opacity-10 flex-col justify-start items-start inline-flex">
      <div className="self-stretch h-36 bg-neutral-900 flex-col justify-start items-start flex">
        <div className="relative h-14 w-full flex justify-center items-center">
          <Image src={agent.profile} alt="Agent Profile" height={56} width={56} className="rounded-full" />
          <CheckBadgeIcon className="absolute bottom-0 right-0 w-6 h-6 text-yellow-400" />
        </div>
      </div>
      <div className="self-stretch px-4 pt-7 pb-2.5 justify-start items-center gap-4 inline-flex">
        <div className="w-40 flex-col justify-start items-start inline-flex">
          <div className="self-stretch h-5 flex-col justify-center items-start">
            <div className="text-white text-xs font-bold font-['Montserrat'] leading-tight">{agent.name}</div>
          </div>
          <div className="self-stretch h-5 flex-col justify-start items-start">
            <div className="text-white text-opacity-60 text-xs font-medium font-['Montserrat'] leading-tight">{agent.location}</div>
          </div>
        </div>
        <div className="grow shrink basis-0 self-stretch pl-3.5 pr-4 pt-px bg-neutral-900 border border-white border-opacity-10 flex justify-center items-center">
          <button className="flex justify-center items-center gap-2 text-white text-xs font-medium font-['Montserrat'] leading-9 tracking-wider" onClick={() => copyToClipboard(agent.address)}>
            <div>FOLLOW</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
