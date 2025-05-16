import { Metadata } from "next";
import Link from "next/link";
import { getAllNodes } from "@/lib/db-functions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Pencil, BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | Portfolio CMS",
  description: "Manage your portfolio content",
};

export default async function DashboardPage() {
  const result = await getAllNodes();
  const nodes = result.code === "nodes/success" ? result.nodes : [];
  
  // Estatísticas básicas
  const totalNodes = nodes.length;
  const totalImages = nodes.reduce((sum, node) => sum + (node.images?.length || 0), 0);
  const totalCategories = new Set(nodes.map(node => node.category).filter(Boolean)).size;
  const totalTags = new Set(nodes.flatMap(node => node.tags || [])).size;
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard 
          title="Portfolio Items" 
          value={totalNodes.toString()} 
          description="Total items"
          icon={<FileText className="h-4 w-4" />}
        />
        <DashboardCard 
          title="Images" 
          value={totalImages.toString()} 
          description="Across all items"
          icon={<FileText className="h-4 w-4" />}
        />
        <DashboardCard 
          title="Categories" 
          value={totalCategories.toString()} 
          description="Unique categories"
          icon={<FileText className="h-4 w-4" />}
        />
        <DashboardCard 
          title="Tags" 
          value={totalTags.toString()} 
          description="Unique tags"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>
      
      {/* Ações rápidas */}
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Add Portfolio Item</CardTitle>
            <CardDescription>Create a new item in your portfolio</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/nodes/new" className="w-full">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Manage Portfolio</CardTitle>
            <CardDescription>View and edit your portfolio items</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/nodes" className="w-full">
              <Button variant="outline" className="w-full">
                <Pencil className="mr-2 h-4 w-4" />
                Manage Items
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">View Analytics</CardTitle>
            <CardDescription>See how your portfolio is performing</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              <BarChart2 className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Últimos itens adicionados */}
      {nodes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Items</h2>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full caption-bottom text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="p-3 text-left font-medium">Title</th>
                  <th className="p-3 text-left font-medium">Category</th>
                  <th className="p-3 text-left font-medium">Created</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {nodes.slice(0, 5).map((node) => (
                  <tr key={node.id} className="border-b">
                    <td className="p-3">{node.nodeTitle}</td>
                    <td className="p-3">{node.category || "—"}</td>
                    <td className="p-3">
                      {node.createdAt instanceof Date
                        ? node.createdAt.toLocaleDateString()
                        : node.createdAt
                        ? new Date(node.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/nodes/${node.id}`}>
                          <Button size="sm" variant="outline">View</Button>
                        </Link>
                        <Link href={`/dashboard/nodes/${node.id}/edit`}>
                          <Button size="sm" variant="outline">Edit</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de estatística com tipagem adequada
function DashboardCard({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
} 