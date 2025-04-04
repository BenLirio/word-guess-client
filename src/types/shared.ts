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
export interface WordTarget {
  x: number;
  y: number;
  size: number;
}

// ==== guess word ====
export interface GuessWordRequest {
  word: string;
}
export interface GuessWordResponse {
  x: number;
  y: number;
  hitTarget: boolean;
}
export type GuessWordFunction = (
  request: GuessWordRequest
) => Promise<GuessWordResponse>;

// ==== get spectrum ====
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetSpectrumRequest {}
export type GetSpectrumResponse = WordSpectrum;
export type GetSpectrumFunction = (
  request: GetSpectrumRequest
) => Promise<GetSpectrumResponse>;

// ==== get target ====
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetTargetRequest {}
export type GetTargetResponse = WordTarget;
export type GetTargetFunction = (
  request: GetTargetRequest
) => Promise<GetTargetResponse>;

export type RequestType =
  | GuessWordRequest
  | GetSpectrumRequest
  | GetTargetRequest;
export type ResponseType =
  | GuessWordResponse
  | GetSpectrumResponse
  | GetTargetResponse;
export type FunctionType =
  | GuessWordFunction
  | GetSpectrumFunction
  | GetTargetFunction;

// derive function name from FunctionType
export type FunctionName = "guessWord" | "getSpectrum" | "getTarget";
export type RequestWrapper = {
  functionName: FunctionName;
  request: RequestType;
};
