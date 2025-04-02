import axios from "axios";
import {
  FunctionType,
  GuessWordRequest,
  GuessWordResponse,
  RequestWrapper,
} from "../types";

const API_URL =
  "https://yj0xqkim6g.execute-api.us-east-1.amazonaws.com/dev/app";

/**
 * Sends a guess word to the API and returns the response.
 * @param request - The request object containing the word to guess.
 * @returns The API response.
 * @throws An error if the request fails.
 */
export const guessWord: FunctionType = async (
  request: GuessWordRequest
): Promise<GuessWordResponse> => {
  if (!request || !request.word) {
    throw new Error("The request object with a valid 'word' is required.");
  }

  const payload: RequestWrapper = {
    functionName: "guessWord",
    request,
  };

  try {
    const response = await axios.post<GuessWordResponse>(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error making the API request:", error);
    throw error;
  }
};
