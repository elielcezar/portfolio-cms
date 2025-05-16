import db from "./firebase";
import {
    addDoc,
    collection,
    serverTimestamp,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { User, Node } from "./types";

export const createNodePosting = async (
    form: FormData,
    user: User
) => {
    const nodeTitle = form.get("nodeTitle") as string;
    const nodeDescription = form.get("nodeDescription") as string;
    
    // Preparar objeto Node com dados recebidos e timestamp
    const nodeData: Partial<Node> = {
        nodeTitle,
        nodeDescription,
        createdBy: user.uid,
        createdAt: serverTimestamp() as any,
    };

    // 👇🏻 add the node to the listing
    const docRef = await addDoc(collection(db, "nodes"), nodeData);

    if (!docRef.id) {
        return { code: "node/failed", status: 500, message: "Failed to create node" }
    }

    return {
        code: "node/success",
        status: 200,
        message: "Node created successfully"
    };
};

/**
 * Recupera todos os nodes do portfólio
 */
export const getAllNodes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "nodes"));
    const nodes: Node[] = [];
    
    querySnapshot.forEach((doc) => {
      nodes.push({ id: doc.id, ...doc.data() } as Node);
    });
    
    return {
      code: "nodes/success",
      status: 200,
      nodes,
      message: "Nodes retrieved successfully"
    };
  } catch (error: any) {
    return {
      code: "nodes/failed",
      status: 500,
      nodes: [],
      message: `Failed to retrieve nodes: ${error.message}`
    };
  }
};

/**
 * Recupera um node específico por ID
 */
export const getNodeById = async (nodeId: string) => {
  try {
    const docRef = doc(db, "nodes", nodeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const nodeData = { id: docSnap.id, ...docSnap.data() } as Node;
      return {
        code: "node/success",
        status: 200,
        node: nodeData,
        message: "Node retrieved successfully"
      };
    } else {
      return {
        code: "node/not-found",
        status: 404,
        node: null,
        message: "Node not found"
      };
    }
  } catch (error: any) {
    return {
      code: "node/failed",
      status: 500,
      node: null,
      message: `Failed to retrieve node: ${error.message}`
    };
  }
};

/**
 * Atualiza um node existente
 */
export const updateNode = async (nodeId: string, updates: Partial<Node>) => {
  try {
    const nodeRef = doc(db, "nodes", nodeId);
    
    // Remove campos que não devem ser atualizados
    const { id: _, createdAt: __, createdBy: ___, ...updateData } = updates;
    
    await updateDoc(nodeRef, updateData);
    
    return {
      code: "node/success",
      status: 200,
      message: "Node updated successfully"
    };
  } catch (error: any) {
    return {
      code: "node/failed",
      status: 500,
      message: `Failed to update node: ${error.message}`
    };
  }
};

/**
 * Exclui um node do portfólio
 */
export const deleteNode = async (nodeId: string) => {
  try {
    await deleteDoc(doc(db, "nodes", nodeId));
    
    return {
      code: "node/success",
      status: 200,
      message: "Node deleted successfully"
    };
  } catch (error: any) {
    return {
      code: "node/failed",
      status: 500,
      message: `Failed to delete node: ${error.message}`
    };
  }
};