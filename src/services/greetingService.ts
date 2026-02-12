import axios from "axios";

interface GreetingResponse {
  text: string;
}

export const getGreeting = async (): Promise<string> => {
  const response = await axios.get<GreetingResponse>("/api/greeting/");

  return response.data.text;
};
