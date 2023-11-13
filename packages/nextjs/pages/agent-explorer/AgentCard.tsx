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
    notification.info("Copied to clipboard");
  };
  return (
    <>
      {agent && (
        <figure
          className="card bg-base-100 shadow-xl p-2 border border-white border-opacity-10 font-['Montserrat'] w-[500px] max-w-full"
          key={agent.id}
        >
          <div
            className="flex flex-col justify-end max-w-full"
            style={{
              backgroundImage: `url(${agent.cover})`,
              height: "200px",
              width: "480px",
              maxWidth: "100%",
            }}
          >
            <div className="m-2 w-fit border-2 border-double border-black border-opacity-50 max-w-full">
              <Image
                src={agent.profile}
                alt="Picture"
                height={128}
                width={128}
                style={{
                  maxWidth: "unset",
                }}
              />
            </div>
          </div>
          <div className="flex flex-row m-2 justify-between items-center">
            <div className="m-4">
              <div className="flex flex-row">
                <span className="text-2xl font-bold mr-1">{agent.name}</span>
                <CheckBadgeIcon className="w-6" style={{ color: "#FEDA03" }} />
              </div>
              <span className="flex w-fit gap-2 flex-col">
                <span className="text-secondary-content inline-flex items-center">
                  {agent.address}
                  <button
                    className="btn btn-neutral btn-xs h-8"
                    onClick={() => copyToClipboard(agent.address)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                      />
                    </svg>
                  </button>
                </span>
                <span className="text-secondary-content">{followers} Followers</span>
              </span>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-lg  border border-white border-opacity-25"
            >
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
      )}
    </>
  );
};

export default AgentCard;
