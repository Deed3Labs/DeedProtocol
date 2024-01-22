import { useEffect, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { withRouter } from "next/router";
import usePaymentCLient from "~~/clients/payment.client";

const Page = ({ router }: WithRouterProps) => {
  const { query } = router;
  const paymentClient = usePaymentCLient();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationId, setRegistrationId] = useState<string | undefined>();

  useEffect(() => {
    if (query.id) {
      fetchIsVerified();
    }
  }, [query.id]);

  const fetchIsVerified = async () => {
    setIsLoading(true);
    const result = await paymentClient.verifyPayment(query.id as string);
    setRegistrationId(result?.registrationId);
    setIsVerified(result?.isVerified ?? false);
    setIsLoading(false);
  };

  return (
    <div className="container">
      <div className="mt-8 flex flex-col justify-center">
        {isLoading && <span className="loading loading-bars loading-lg my-8"></span>}
        {!isLoading && (
          <>
            {isVerified && <h1>Payment is verified 🎉🎉🎉</h1>}
            {!isVerified && <h1>Payment is not verified</h1>}
            <div className="flex mt-4">
              <Link className="btn" href={`/registration/${registrationId}`}>
                Goto registration
              </Link>
              <button className="btn" onClick={() => fetchIsVerified()}>
                Retry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(Page);
