import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { AgentModel } from "~~/models/agent.model";

type Props = {
  agent: AgentModel;
};

export default function PropertyCard({ agent }: Props) {
  return (
    <figure
      className="card bg-base-100 shadow-xl p-2 bg-secondary border border-white border-opacity-10 font-['Montserrat'] w-[500px]"
      key={agent.id}
    >
      <div
        className="flex flex-col justify-end"
        style={{
          backgroundImage: `url(${agent.cover})`,
          height: "200px",
          width: "480px",
        }}
      >
        <div className="m-2 w-16">
          <Image src={agent.profile} alt="Picture" height={128} width={127} />
        </div>
      </div>
      <div className="flex flex-row m-2 justify-between items-center">
        <div className="m-4">
          <div className="flex flex-row">
            <span className="text-2xl font-bold mr-1">{agent.name}</span>
            <CheckBadgeIcon className="w-6" style={{ color: "#FEDA03" }} />
          </div>
          <span className="flex flex-h w-fit gap-2">
            <span className="text-secondary-content">Username.eth</span>
          </span>
        </div>
        <button type="button" className="btn btn-outline btn-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Follow
        </button>
      </div>
    </figure>
  );
}
