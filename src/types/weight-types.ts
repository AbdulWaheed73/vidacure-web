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
};

export type WeightHistoryResponse = {
  weightHistory: WeightHistoryEntry[];
};

export type AddWeightHistoryResponse = {
  message: string;
  entry: WeightHistoryEntry;
};