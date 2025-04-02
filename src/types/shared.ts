export interface GuessWordRequest {
  word: string;
}
export interface GuessWordResponse {
  x: number;
  y: number;
}
export type GuessWordFunction = (
  request: GuessWordRequest
) => Promise<GuessWordResponse>;

export type RequestType = GuessWordRequest;
export type ResponseType = GuessWordResponse;
export type FunctionType = GuessWordFunction;

// derive function name from FunctionType
export type FunctionName = "guessWord";
export type RequestWrapper = {
  functionName: FunctionName;
  request: RequestType;
};
