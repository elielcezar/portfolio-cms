"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
//import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { getAllNodes, deleteNode } from "@/lib/db-functions";
import { Node } from "@/lib/types";
import { Pencil, Trash2, ExternalLink, ImageIcon } from "lucide-react";
import NodeFilter from "./NodeFilter";

export default function NodeList() {  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchNodes = async () => {
    setLoading(true);
    try {
      const result = await getAllNodes();
      if (result.code === "nodes/success") {
        setNodes(result.nodes);
        setFilteredNodes(result.nodes);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load nodes");      
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNodes();
  }, []);
  
  const handleDelete = async (nodeId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const result = await deleteNode(nodeId);
      
      if (result.code === "node/success") {
        toast.success("Item deleted successfully");
      }
        // Atualizar a lista
        fetchNodes();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete item");
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading portfolio items...</div>;
  }
  
  if (nodes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">No portfolio items found</p>
        <Link href="/dashboard/nodes/new">
          <Button>Create New Item</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Portfolio Items</h2>
        <Link href="/dashboard/nodes/new">
          <Button>Create New Item</Button>
        </Link>
      </div>
      
      <NodeFilter nodes={nodes} onFilterChange={setFilteredNodes} />
      
      {filteredNodes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No items match your filters</p>
          <Button variant="link" onClick={() => setFilteredNodes(nodes)}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNodes.map((node) => (
            <Card key={node.id} className="overflow-hidden">
              <div className="aspect-video relative bg-gray-100">
                {node.images && node.images.length > 0 ? (
                  <Image
                    src={node.images[0]}
                    alt={node.nodeTitle}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-1">{node.nodeTitle}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {node.nodeDescription}
                </p>
                
                {node.tags && node.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {node.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Link href={`/dashboard/nodes/${node.id}/edit`}>
                    <Button size="sm" variant="outline">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => node.id && handleDelete(node.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
                
                <Link href={`/dashboard/nodes/${node.id}`}>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 