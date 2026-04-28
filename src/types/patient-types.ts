export type PatientProfile = {
  userId: string;
  name: string;
  givenName: string;
  familyName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  height?: number;
  bmi?: number;
  goalWeight?: number;
  role: "patient";
  hasCompletedOnboarding?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PatientProfileResponse = {
  profile: PatientProfile;
};

export type UpdatePatientProfileData = {
  email?: string;
  phone?: string;
  height?: number;
  goalWeight?: number;
};
