/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "use-react-screenshot" {
  type UseScreenshot = (options: {
    type: "image/jpeg" | "image/png";
    quality: number;
  }) => [string | null, (ref: HTMLDivElement) => Promise<string | null>];
  type CreateFileName = (extension: string, ...names: string[]) => string;
  const useScreenshot: UseScreenshot;
  const createFileName: CreateFileName;
  export { useScreenshot, createFileName };
}
