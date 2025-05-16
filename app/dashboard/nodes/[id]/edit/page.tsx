import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/firebase";
import { getNodeById } from "@/lib/db-functions";
import NodeForm from "@/components/node/NodeForm";

interface EditNodePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditNodePageProps): Promise<Metadata> {
  return {
    title: "Edit Portfolio Item | Dashboard",
    description: "Edit your portfolio item",
  };
}

export default async function EditNodePage({ params }: EditNodePageProps) {
  // Este é apenas um exemplo - você precisará implementar a verificação de autenticação real
  const user = auth.currentUser;
  
  if (!user) {
    redirect(`/login?redirect=/dashboard/nodes/${params.id}/edit`);
  }
  
  const result = await getNodeById(params.id);
  
  if (result.code !== "node/success") {
    redirect("/dashboard/nodes");
  }
  
  return (
    <div className="container py-8">
      <NodeForm user={user} node={result.node} mode="edit" />
    </div>
  );
} 