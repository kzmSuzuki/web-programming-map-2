declare module "jsonp" {
  interface Options {
    name?: string;
    param?: string;
    timeout?: number;
    prefix?: string;
  }

  type JsonpCallback = (error: Error | null, data?: any) => void;

  export default function jsonp(
    url: string,
    options: Options,
    callback: JsonpCallback
  ): void;
}
