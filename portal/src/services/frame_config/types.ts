export interface AddLogoConfigProps {
  lconfigFiletoken: string;
  lconfigId: number;
  lconfigName: string;
  originFileName: string;
}
export interface AddLogoConfigResponse {}
export interface UpdateIndexPicProps {
  ipicFiletoken: string;
  ipicId: number;
  ipicIsenable: number;
  ipicName: string;
  ipicSort: number;
  originFileName: string;
}
export interface FetchCommonConfigResponse {
  cconfigId: number;
  cconfigCode: string;
  cconfigName: string;
  cconfigFiletoken: string;
  originFileName: string;
  cconfigUrlpath: string;
  cconfigSort: number;
  cconfigIsenable: number;
}
export interface UpdateCommonConfigProps {
  cconfigCode: string;
  cconfigFiletoken: string;
  cconfigId: number;
  cconfigIsenable: number;
  cconfigName: string;
  cconfigParentid: number;
  cconfigSort: number;
  cconfigUrlpath: string;
  originFileName: string;
}