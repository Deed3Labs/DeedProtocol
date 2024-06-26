import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { AgentModel } from "~~/models/agent.model";

interface Props {
  agent: AgentModel;
  small?: boolean;
}

const AgentCard = ({ agent, small = false }: Props) => {
  const followers = useMemo(() => {
    if (!agent) return undefined;
    if (agent.followers >= 1000) {
      return (agent.followers / 1000).toFixed(1) + "K";
    }
    return agent.followers.toString();
  }, [agent?.followers]);

  const image = (
    <div
      className={`self-stretch ${
        small ? "h-16 w-16" : "h-36"
      } bg-neutral-900 flex-col justify-end items-start flex relative`}
    >
      <div className={`h-14 ${small ? "h-16 w-16" : "p-0"} border border-white border-opacity-10 flex justify-center items-center`}>
        <Image
          src={agent.profile}
          alt="Agent Profile"
          height={small ? 64 : 56}
          width={small ? 64 : 56}
          layout="fixed"
          className=""
        />
        {!small && (
          <CheckBadgeIcon
            className="absolute text-yellow-400 w-5 h-5"
            style={{ right: "1.25rem", bottom: "0.125rem" }}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className={`w-full ${small ? "h-24 p-0" : "h-60 p-2 bg-[#0e0e0e]"} border border-white border-opacity-10 flex-col justify-start items-start inline-flex`}>
      {small ? (
        <div className="flex flex-col items-center">
          {image}
          <div className="text-white text-xs font-bold font-['Montserrat'] mt-2">{agent.name}</div>
        </div>
      ) : (
        <>
          {image}
          <div className="self-stretch px-4 pt-7 pb-2.5 justify-start items-center gap-4 inline-flex">
            <div className="flex-col justify-start items-start">
              <div className="text-white text-xs font-bold font-['Montserrat']">{agent.name}</div>
              <div className="text-white text-opacity-60 text-xs font-medium font-['Montserrat']">
                {agent.location}
              </div>
              <div className="text-white text-opacity-60 text-xs font-medium font-['Montserrat']">
                {followers} Followers
              </div>
            </div>
            <Link
              href={`/agent/${agent.id}`}
              className="btn btn-neutral btn-xs self-stretch flex justify-center items-center"
              passHref
            >
              FOLLOW
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default AgentCard;
