import { PricingTable } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-[70%]">
      <h2 className="text-3xl font-bold my-5">Pricing</h2>
      <div className="flex w-[800px]">
        <PricingTable />
      </div>
    </div>
  );
};

export default page;