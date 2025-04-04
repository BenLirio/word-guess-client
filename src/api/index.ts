import axios from "axios";
import {
  GuessWordFunction,
  GuessWordRequest,
  GuessWordResponse,
  RequestWrapper,
  GetSpectrumFunction,
  GetSpectrumRequest,
  GetSpectrumResponse,
  GetTargetFunction,
  GetTargetRequest,
  GetTargetResponse,
} from "../types";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/dev/app"
    : "https://yj0xqkim6g.execute-api.us-east-1.amazonaws.com/dev/app";

/**
 * Sends a guess word to the API and returns the response.
 * @param request - The request object containing the word to guess.
 * @returns The API response.
 * @throws An error if the request fails.
 */
export const guessWord: GuessWordFunction = async (
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

/**
 * Sends a request to get the spectrum data from the API and returns the response.
 * @param request - The request object (empty for this function).
 * @returns The API response containing spectrum data.
 * @throws An error if the request fails.
 */
export const getSpectrum: GetSpectrumFunction = async (
  request: GetSpectrumRequest
): Promise<GetSpectrumResponse> => {
  const payload: RequestWrapper = {
    functionName: "getSpectrum",
    request,
  };

  try {
    const response = await axios.post<GetSpectrumResponse>(API_URL, payload, {
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

/**
 * Sends a request to get the target data from the API and returns the response.
 * @param request - The request object (empty for this function).
 * @returns The API response containing target data.
 * @throws An error if the request fails.
 */
export const getTarget: GetTargetFunction = async (
  request: GetTargetRequest
): Promise<GetTargetResponse> => {
  const payload: RequestWrapper = {
    functionName: "getTarget",
    request,
  };

  try {
    const response = await axios.post<GetTargetResponse>(API_URL, payload, {
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
