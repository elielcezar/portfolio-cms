export interface User {
    uid?: string;
    name: string;
    email: string;
    password?: string;
    displayName?: string;
    // Outros campos conforme necessário
}

export interface Node {
    id?: string;
    nodeTitle: string;
    nodeDescription: string;
    createdBy?: string; // UID do usuário que criou
    createdAt?: Date | string;
    // Imagens, tags, categorias, etc.
    images?: string[];
    tags?: string[];
    category?: string;
    // Outros campos específicos para itens de portfólio
} 