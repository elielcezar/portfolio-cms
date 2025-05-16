import { Metadata } from "next";
import { redirect } from "next/navigation";
import NodeForm from "@/components/node/NodeForm";
import { cookies } from "next/headers";
import { getUserFromCookie } from "@/lib/auth-functions";

export const metadata: Metadata = {
  title: "Create Portfolio Item | Dashboard",
  description: "Create a new portfolio item",
};

export default async function NewNodePage() {
  const authSession = cookies().get("auth-session");
  
  if (!authSession?.value) {
    redirect("/login?redirect=/dashboard");
  }

  const user = await getUserFromCookie(authSession.value);
  
  if (!user) {
    redirect("/login?redirect=/dashboard");
  }
  
  return (
    <div className="container py-8">
      <NodeForm mode="create" user={user} />
    </div>
  );
} 