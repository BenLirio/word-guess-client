export interface WordSpectrum {
  x: {
    left: string;
    right: string;
  };
  y: {
    left: string;
    right: string;
  };
}
// ================
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetSpectrumRequest {}

export type GetSpectrumResponse = WordSpectrum;
export type GetSpectrumFunction = (
  request: GetSpectrumRequest
) => Promise<GetSpectrumResponse>;

export type RequestType = GuessWordRequest | GetSpectrumRequest;
export type ResponseType = GuessWordResponse | GetSpectrumResponse;
export type FunctionType = GuessWordFunction | GetSpectrumFunction;

// derive function name from FunctionType
export type FunctionName = "guessWord" | "getSpectrum";
export type RequestWrapper = {
  functionName: FunctionName;
  request: RequestType;
};
