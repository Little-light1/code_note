import axios from "axios";

export { default as GRequest } from "./request";

export type { GRequestProps, StandardResponse } from "./types";

export const isAxiosError = axios.isAxiosError;

export type { AxiosError } from "axios";
