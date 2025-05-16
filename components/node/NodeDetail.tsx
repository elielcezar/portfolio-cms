"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
//import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { getNodeById, deleteNode } from "@/lib/db-functions";
import { Node } from "@/lib/types";
import { ChevronLeft, Pencil, Trash2, CalendarIcon } from "lucide-react";
import ImageViewer from "./ImageViewer";

interface NodeDetailProps {
  nodeId: string;
}

export default function NodeDetail({ nodeId }: NodeDetailProps) {
  const router = useRouter();
  //const { toast } = useToast();
  const [node, setNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const fetchNode = async () => {
    setLoading(true);
    try {
      const result = await getNodeById(nodeId);
      
      if (result.code === "node/success") {
        setNode(result.node);
      } else if (result.code === "node/not-found") {
        toast.error("The portfolio item was not found");       
        router.push("/dashboard/nodes");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load portfolio item");      
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNode();
  }, [nodeId]);
  
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const result = await deleteNode(nodeId);
      
      if (result.code === "node/success") {
        toast.success("Item deleted successfully");
        router.push("/dashboard/nodes");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete item");
    }
  };
  
  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading portfolio item...</div>;
  }
  
  if (!node) {
    return <div className="text-center py-8">Portfolio item not found</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex gap-2">
          <Link href={`/dashboard/nodes/${nodeId}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">{node.nodeTitle}</h1>
        
        {node.category && (
          <div className="mt-2">
            <Badge variant="secondary">{node.category}</Badge>
          </div>
        )}
        
        {node.createdAt && (
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>
              {node.createdAt instanceof Date 
                ? node.createdAt.toLocaleDateString() 
                : new Date(node.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      
      {node.images && node.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {node.images.map((imageUrl, index) => (
            <Card 
              key={index} 
              className="overflow-hidden cursor-pointer"
              onClick={() => openImageViewer(index)}
            >
              <div className="aspect-video relative">
                <Image
                  src={imageUrl}
                  alt={`${node.nodeTitle} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p>{node.nodeDescription}</p>
          </div>
        </CardContent>
      </Card>
      
      {node.tags && node.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {node.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Image viewer */}
      {node.images && node.images.length > 0 && (
        <ImageViewer
          images={node.images}
          initialIndex={selectedImageIndex}
          open={imageViewerOpen}
          onOpenChange={setImageViewerOpen}
        />
      )}
    </div>
  );
} 