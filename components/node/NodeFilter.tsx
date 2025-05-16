"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Node } from "@/lib/types";

interface NodeFilterProps {
  nodes: Node[];
  onFilterChange: (filtered: Node[]) => void;
}

export default function NodeFilter({ nodes, onFilterChange }: NodeFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Extrair categorias e tags únicas
  const categories = [...new Set(nodes.map(node => node.category).filter(Boolean))];
  const allTags = [...new Set(nodes.flatMap(node => node.tags || []))];
  
  const applyFilters = () => {
    let filtered = [...nodes];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(node => 
        node.nodeTitle.toLowerCase().includes(term) || 
        node.nodeDescription.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(node => node.category === selectedCategory);
    }
    
    // Filtrar por tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(node => 
        selectedTags.every(tag => node.tags?.includes(tag))
      );
    }
    
    onFilterChange(filtered);
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedTags([]);
    onFilterChange(nodes);
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Aplicar filtros quando algum critério mudar
  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedTags]);
  
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search portfolio items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-7 w-7 text-muted-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          {categories.length > 0 && (
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
                {(selectedCategory || selectedTags.length > 0) && (
                  <Badge variant="secondary" className="ml-1">
                    {(selectedCategory ? 1 : 0) + selectedTags.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Portfolio Items</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(
                            selectedCategory === category ? null : category
                          )}
                        >
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No categories available</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.length > 0 ? (
                      allTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags available</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <DialogClose asChild>
                  <Button>Apply Filters</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Exibir filtros ativos */}
      {(selectedCategory || selectedTags.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {selectedCategory}
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="hover:bg-gray-200 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              Tag: {tag}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                className="hover:bg-gray-200 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
} 