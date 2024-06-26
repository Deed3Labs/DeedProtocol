import { useEffect, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { withRouter } from "next/router";
import usePaymentClient from "~~/clients/payments.client";

const Page = ({ router }: WithRouterProps) => {
  const { query } = router;
  const paymentClient = usePaymentClient();
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
        {isLoading && <span className="loading loading-bars loading-lg my-8" />}
        {!isLoading && (
          <>
            <div className="card w-96 bg-neutral">
              <div className="card-body items-center text-center">
                <h2 className="card-title">
                  {isVerified ? (
                    <span className="text-success">Congratulation</span>
                  ) : (
                    "Payment not confirmed"
                  )}
                </h2>
                {isVerified ? (
                  <p>You have successfully registered your property.</p>
                ) : (
                  <p>
                    We encountered some problem verifying the payment, please go back to the
                    registration and click the payment button. If you have already paid, please
                    contact us.
                  </p>
                )}
                <div className="card-actions justify-end">
                  <Link className="btn" href={`/validation/${registrationId}`}>
                    Go to validation page &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(Page);
