import { redirect } from "next/navigation";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getRegisterLink } from "@/lib/utils";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect(getRegisterLink());

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.email || "",
      },
    });
  }

  return <Dashboard />;
};

export default Page;
