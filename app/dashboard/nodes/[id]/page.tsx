import { Metadata } from "next";
import { auth } from "@/lib/firebase";
import { getNodeById } from "@/lib/db-functions";
import NodeDetail from "@/components/node/NodeDetail";

interface NodePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: NodePageProps): Promise<Metadata> {
  const result = await getNodeById(params.id);
  
  if (result.code === "node/success") {
    return {
      title: `${result.node.nodeTitle} | Dashboard`,
      description: result.node.nodeDescription,
    };
  }
  
  return {
    title: "Portfolio Item | Dashboard",
    description: "View portfolio item details",
  };
}

export default async function NodePage({ params }: NodePageProps) {
  return (
    <div className="container py-8">
      <NodeDetail nodeId={params.id} />
    </div>
  );
} 