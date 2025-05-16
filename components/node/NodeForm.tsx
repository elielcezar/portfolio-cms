"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createNodePosting, updateNode } from "@/lib/db-functions";
import { Node, User } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import TagSelector from "./TagSelector";

interface NodeFormProps {
  user: User;
  node?: Node; // Opcional para modo de edição
  mode: "create" | "edit";
}

export default function NodeForm({ user, node, mode }: NodeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nodeTitle: node?.nodeTitle || "",
    nodeDescription: node?.nodeDescription || "",
    tags: node?.tags || [],
    category: node?.category || ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Formulário enviado!");
    
    try {
      if (mode === "create") {
        // Criar um FormData para enviar
        const form = new FormData();
        form.append("nodeTitle", formData.nodeTitle);
        form.append("nodeDescription", formData.nodeDescription);
        form.append("category", formData.category);
        
        // Se createNodePosting não existir ou não funcionar corretamente,
        // vamos criar o node diretamente
        toast.success("Criando novo item no portfólio...");
        
        try {
          // Implementação corrigida usando Firebase
          const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
          // Importar db diretamente, já que é a exportação padrão do seu firebase.ts
          const db = await import("@/lib/firebase").then(module => module.default);
          
          const docRef = await addDoc(collection(db, "nodes"), {
            nodeTitle: formData.nodeTitle,
            nodeDescription: formData.nodeDescription,
            category: formData.category,
            tags: formData.tags,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: user.id,
            images: []
          });
          
          console.log("Documento criado com ID:", docRef.id);
          toast.success("Item criado com sucesso!");
          
          // Redirecionar após salvar
          setTimeout(() => {
            router.push("/dashboard/nodes");
          }, 1000);
        } catch (firebaseError) {
          console.error("Erro ao salvar no Firebase:", firebaseError);
          toast.error("Erro ao salvar no banco de dados");
        }
      } else if (mode === "edit" && node?.id) {
        // Tratar edição...
      }
    } catch (error) {
      console.error("Erro geral:", error);
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New Portfolio Item" : "Edit Portfolio Item"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nodeTitle">Title</Label>
            <Input 
              id="nodeTitle"
              name="nodeTitle"
              value={formData.nodeTitle}
              onChange={handleChange}
              placeholder="Enter title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nodeDescription">Description</Label>
            <Textarea 
              id="nodeDescription"
              name="nodeDescription"
              value={formData.nodeDescription}
              onChange={handleChange}
              placeholder="Enter description"
              rows={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagSelector 
              selectedTags={formData.tags} 
              onChange={handleTagsChange} 
            />
          </div>
          
          {mode === "edit" && node?.id && (
            <div className="space-y-2">
              <Label>Images</Label>
              <ImageUploader nodeId={node.id} existingImages={node.images || []} />
            </div>
          )}
          
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : mode === "create" ? "Create" : "Update"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 