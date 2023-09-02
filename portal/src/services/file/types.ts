export interface FetchImageUrlMapResponse {
  [key: string]: string;
}
export interface FetchFileMapResponse {
  [key: string]: {
    id: number;
    filePath: string;
    fileToken: string;
    createTime: number[];
    originFileName: string;
  };
}