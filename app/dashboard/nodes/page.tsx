import { Metadata } from "next";
import { auth } from "@/lib/firebase";
import NodeList from "@/components/node/NodeList";

export const metadata: Metadata = {
  title: "Portfolio Items | Dashboard",
  description: "Manage your portfolio items",
};

export default async function NodesPage() {
  return (
    <div className="container py-8">
      <NodeList />
    </div>
  );
} 