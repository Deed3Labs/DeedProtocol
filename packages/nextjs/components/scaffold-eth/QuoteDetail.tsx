interface Props {
  price: number;
  title: string;
  secondary: string;
}
const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const QuoteDetails = ({ price, title, secondary }: Props) => {
  return (
    <div className="flex flex-col my-2">
      <div className="flex flex-row h-fit items-center mb-0 justify-between">
        <span className="text-md font-normal mr-6">{title}</span>
        <span className=" text-md">{USDollar.format(price)}</span>
      </div>
      <span className="text-gray-500 text-xs">{secondary}</span>
    </div>
  );
};

export default QuoteDetails;
