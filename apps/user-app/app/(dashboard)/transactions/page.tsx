import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { Card } from "@repo/ui/card";

async function getp2pTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
    },
    orderBy: { timestamp: "desc" },
  });
  return txns.map((tx) => ({
    time: tx.timestamp,
    amount: tx.amount,
    fromUserId: tx.fromUserId,
    toUserId: tx.toUserId,
  }));
}

export default async function () {
  const transactions = await getp2pTransactions();
  return (
    <div className="w-full h-full">
      <div className="text-2xl text-[#6a51a6] pt-6 pl-5 mb-4 font-bold subpixel-antialiased">
        Transactions
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 p-5">
        <Card title="Recent Transactions">
          <div className="pt-2">
            {transactions.map((t, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <div className="text-sm">Send INR</div>
                  <div className="text-slate-600 text-xs">
                    {t.time.toDateString()}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  + Rs {t.amount / 100}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
