import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { updateNode } from "./db-functions";
import { Node } from "./types";

/**
 * Faz upload de uma imagem para o Firebase Storage
 * @param file Arquivo a ser enviado
 * @param path Caminho onde o arquivo será armazenado
 * @returns URL do arquivo no Storage
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Adiciona uma imagem a um node existente
 * @param nodeId ID do node
 * @param file Arquivo de imagem
 */
export const addImageToNode = async (nodeId: string, file: File) => {
  try {
    // Cria um nome de arquivo único baseado no timestamp
    const fileName = `${Date.now()}_${file.name}`;
    const path = `nodes/${nodeId}/images/${fileName}`;
    
    // Faz upload da imagem
    const imageUrl = await uploadImage(file, path);
    
    // Recupera o node atual
    const nodeResponse = await updateNode(nodeId, {
      images: arrayUnion(imageUrl) // Adiciona a nova URL ao array de imagens
    });
    
    return {
      code: "image/success",
      status: 200,
      imageUrl,
      message: "Image added successfully"
    };
  } catch (error) {
    return {
      code: "image/failed",
      status: 500,
      message: "Failed to add image to node"
    };
  }
};

/**
 * Remove uma imagem de um node
 * @param nodeId ID do node
 * @param imageUrl URL da imagem a ser removida
 */
export const removeImageFromNode = async (nodeId: string, imageUrl: string) => {
  try {
    // Extrai o caminho da URL para remover do Storage
    const imagePath = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
    const imageRef = ref(storage, imagePath);
    
    // Tenta remover a imagem do Storage
    await deleteObject(imageRef);
    
    // Atualiza o node para remover a referência
    await updateNode(nodeId, {
      images: arrayRemove(imageUrl)
    });
    
    return {
      code: "image/success",
      status: 200,
      message: "Image removed successfully"
    };
  } catch (error) {
    return {
      code: "image/failed",
      status: 500,
      message: "Failed to remove image from node"
    };
  }
}; 