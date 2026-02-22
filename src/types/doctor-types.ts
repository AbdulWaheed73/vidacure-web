export type DoctorProfile = {
  userId: string;
  name: string;
  givenName: string;
  familyName: string;
  email?: string;
  role: 'doctor';
  createdAt: string;
  updatedAt: string;
};

export type DoctorProfileResponse = {
  profile: DoctorProfile;
};
