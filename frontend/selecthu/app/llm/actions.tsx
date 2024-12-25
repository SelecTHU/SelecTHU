"use server"
import { Message } from "./components/chat/types";
import { auth } from "@/auth"

export async function getAIMessage(fullContent: string) {
    const session = await auth()
    const jwt = session.user.backend_jwt
    const response = await fetch(process.env.BACKEND_URL + '/chatbot-reply/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + jwt,
        },
        body: JSON.stringify({
          'user-input': fullContent
        })
      });

      console.log("body", JSON.stringify({
          'user-input': fullContent
        }))

      console.log(response)
      if (response.status === 200) {
        const data = await response.json();
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          type: "ai",
          timestamp: new Date(),
        };
        
        return aiMessage;
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "抱歉，我遇到了一些问题，请稍后再试。",
          type: "ai",
          timestamp: new Date(),
        };
        
        return aiMessage;
      }
}

export async function getUserData() {
  try {
    const session = await auth()
    const jwt = session.user.backend_jwt
    const response = await fetch(process.env.BACKEND_URL + '/user/', {
      headers: {
        "Authorization": "Bearer " + jwt,
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      return data.user;
    } else {
      console.error('Failed to fetch user data');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}