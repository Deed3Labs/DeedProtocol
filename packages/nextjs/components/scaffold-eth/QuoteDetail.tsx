interface Props {
  price: number;
  title: string;
  secondary?: string;
}
export const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const QuoteDetails = ({ price, title, secondary }: Props) => {
  return (
    <div className="flex flex-col my-2 text-xl">
      <div className="flex flex-row h-fit items-center mb-0 justify-between">
        <span className="font-normal">{title}</span>
        <span className="">{USDollar.format(price)}</span>
      </div>
      {secondary && <span className="text-secondary text-sm uppercase">{secondary}</span>}
    </div>
  );
};

export default QuoteDetails;
