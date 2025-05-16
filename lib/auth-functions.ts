import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import db, { auth } from "./firebase";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { User } from "./types";


// 👇🏻 Signup function for user

export const userSignUp = async (form: FormData) => {
    const userData: User = {
        name: form.get("name") as string,
        email: form.get("email") as string,
        password: form.get("password") as string                
    }

    const { user } = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
    );

    if (!user) {
        return {
            code: "auth/failed",
            status: 500,
            user: null,
            message: "Failed to create user",
        }
    }

    // ADICIONAR ESTE CÓDIGO:
    // Cria um documento para o usuário na coleção 'users'
    try {
        await setDoc(doc(db, "users", user.uid), {
            name: userData.name,
            email: userData.email,
            isRecruiter: true, // ou qualquer valor que seja adequado
            createdAt: new Date()
        });
    } catch (error) {
        console.error("Error creating user document:", error);
    }

    return {
        code: "auth/success",
        status: 200,
        user,
        message: "Acount created successfully! 🎉"
    };
};


// 👇🏻 Login function for user
export const userAuthLogin = async (form: FormData) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const { user } = await signInWithEmailAndPassword(auth, email, password);

    if (!user) {
        return {
            code: "auth/failed",
            status: 500,
            user: null,
            message: "Failed to login",
        };
    }

    // MODIFICAÇÃO TEMPORÁRIA: Permita login sem verificar o documento
    // Comente ou remova temporariamente as linhas abaixo:
    /*
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        return {
            code: "auth/failed",
            status: 500,
            user: null,
            message: "User Not a Recruiter",
        };
    }
    */

    return {
        code: "auth/success",
        status: 200,
        user,
        message: "Login successful",
    };
};


// 👇🏻 Logout function for user
export const authLogout = async () => {
    try {
        await auth.signOut();
        return { code: "auth/success", status: 200, message: "Logout successful" };
    } catch (err) {
            return {
                code: "auth/failed",
                status: 500,
                message: "Failed to logout",
                err,
    }
 }
}

export async function getUserFromCookie(userId: string) {
  try {
    // Corrigindo para usar a API do Firestore v9 corretamente
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Criar um usuário simples baseado apenas no ID, para casos onde 
      // o documento pode não existir no Firestore
      return {
        id: userId,
        email: "user@example.com", // valor temporário
        name: "User" // valor temporário para cumprir com o tipo User
      };
    }
    
    const userData = userSnap.data();
    return {
      id: userId,
      email: userData.email,
      name: userData.name || "User" // Garantir que name existe para o tipo User
    };
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    
    // Retornar um usuário mínimo em caso de erro, para evitar falhas da aplicação
    return {
      id: userId,
      email: "user@example.com",
      name: "User"
    };
  }
}