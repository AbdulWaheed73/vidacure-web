export type WeightHistoryEntry = {
  weight: number;
  date: string; // yyyy-mm-dd format
  sideEffects?: string;
  notes?: string;
};

export type AddWeightHistoryRequest = {
  weight: number;
  sideEffects?: string;
  notes?: string;
  date?: string; // yyyy-mm-dd; defaults to today server-side when omitted
};

export type WeightHistoryResponse = {
  weightHistory: WeightHistoryEntry[];
  height: number; // Patient height in cm
};

export type AddWeightHistoryResponse = {
  message: string;
  entry: WeightHistoryEntry;
};