export type TreatmentJournalData = {
  _id?: string;
  content: string;
  doctorName?: string;
  createdAt: string;
  updatedAt: string;
};

export type TreatmentJournalResponse = {
  journal: TreatmentJournalData | null;
};
