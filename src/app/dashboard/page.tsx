import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import Dashboard from "@/components/Dashboard";
import { getRegisterLink } from "@/lib/utils";

const Page = async () => {
    const { getUser } = getKindeServerSession()
    const user = getUser()


    if (!user || !user.id) redirect(getRegisterLink())


    const dbUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    if(!dbUser) redirect(getRegisterLink())

    return <Dashboard />
}

export default Page