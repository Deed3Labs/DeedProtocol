import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

const Page = ({ router }: WithRouterProps) => {
  console.log({ router });
  return <div className="container"></div>;
};

export default withRouter(Page);
