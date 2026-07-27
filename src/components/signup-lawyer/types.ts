export type SupplementalOabEntry = {
  number: string;
  uf: string;
  issueDate: string;
  frontUri: string;
  backUri: string;
};

export type PostgraduateEntry = {
  university: string;
  course: string;
  year: string;
};

export type LawyerSignupFormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  motherName: string;
  fatherName: string;
  noFatherName: boolean;
  rg: string;
  issuingAuthority: string;
  uf: string;
  cpf: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  oabNumber: string;
  oabUf: string;
  oabIssueDate: string;
  oabFrontUri: string;
  oabBackUri: string;
  supplementalOabs: SupplementalOabEntry[];
  university: string;
  course: string;
  graduationYear: string;
  postgraduates: PostgraduateEntry[];
  practiceAreas: string[];
  specialties: string[];
  serviceState: string;
  serviceCity: string;
  billingMethods: string[];
  pronouns: string;
  profileImageUri: string;
  biography: string;
};
