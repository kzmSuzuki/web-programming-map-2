export interface Data {
  id: string;
  clearedNum: number;
  label: string;
  notionUrl: string;
  quoteEn: string;
  quoteJa: string;
  state: "initial" | "cleared" | string | number;
}
