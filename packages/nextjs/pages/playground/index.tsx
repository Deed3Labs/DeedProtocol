import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import useIsAdmin from "~~/hooks/contracts/access-manager/useIdAdmin.hook";

const Playground = ({ router }: WithRouterProps) => {
  const isAdmin = useIsAdmin();

  return (
    <div className="container pt-10">
      {isAdmin ? (
        <></>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          <div className="text-2xl leading-10">Restricted</div>
          <div className="text-base font-normal leading-normal">
            This section is restricted to admin users only.
          </div>
          <button
            onClick={() => router.push("/property-explorer")}
            className="btn btn-lg bg-gray-600"
          >
            Go back to explorer
          </button>
        </div>
      )}
    </div>
  );
};

export default withRouter(Playground);
