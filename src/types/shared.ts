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
export interface LeaderboardEntry {
  id: string;
  username?: string;
  word: string;
  x: number;
  y: number;
  hitTarget: boolean;
  timestamp: number;
}

// ==== guess word ====
export interface GuessWordRequest {
  word: string;
}
export interface GuessWordResponse {
  word: string;
  x: number;
  y: number;
  hitTarget: boolean;
  token?: string;
  timestamp: number;
  id: string;
}
export type GuessWordFunction = (
  request: GuessWordRequest
) => Promise<GuessWordResponse>;

// ==== getTimeUntilNextGraph ====
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetTimeUntilNextGraphRequest {}
export type GetTimeUntilNextGraphResponse = {
  timeOfNextGraph: number;
  timeMod: number;
};
export type GetTimeUntilNextGraphFunction = (
  request: GetTimeUntilNextGraphRequest
) => Promise<GetTimeUntilNextGraphResponse>;

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

// ==== post win ====
export interface PostWinRequest {
  token: string;
  username: string;
}
export interface PostWinResponse {
  incremented: boolean;
  winCount: number;
}
export type PostWinFunction = (
  request: PostWinRequest
) => Promise<PostWinResponse>;

// ==== list wins ====
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ListWinsRequest {}
export type ListWinsResponse = {
  wins: {
    username: string;
    winCount: number;
  }[];
};
export type ListWinsFunction = (
  request: ListWinsRequest
) => Promise<ListWinsResponse>;

// ==== get leaderboard ====
export interface GetLeaderboardRequest {
  afterTimestamp?: number;
}
export type GetLeaderboardResponse = {
  timestamp: number;
  leaderboardEntries: LeaderboardEntry[];
};
export type GetLeaderboardFunction = (
  request: GetLeaderboardRequest
) => Promise<GetLeaderboardResponse>;

export type RequestType =
  | GuessWordRequest
  | GetSpectrumRequest
  | GetTargetRequest
  | PostWinRequest
  | GetLeaderboardRequest
  | GetTimeUntilNextGraphRequest
  | ListWinsRequest;
export type ResponseType =
  | GuessWordResponse
  | GetSpectrumResponse
  | GetTargetResponse
  | PostWinResponse
  | GetTimeUntilNextGraphResponse
  | GetLeaderboardResponse
  | ListWinsResponse;
export type FunctionType =
  | GuessWordFunction
  | GetSpectrumFunction
  | GetTargetFunction
  | PostWinFunction
  | GetTimeUntilNextGraphFunction
  | GetLeaderboardFunction
  | ListWinsFunction;

// derive function name from FunctionType
export type FunctionName =
  | "guessWord"
  | "getSpectrum"
  | "getTarget"
  | "postWin"
  | "getTimeUntilNextGraph"
  | "getLeaderboard"
  | "listWins";
export type RequestWrapper = {
  functionName: FunctionName;
  request: RequestType;
};
