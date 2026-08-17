export type SupplementalOabEntry = {
  number: string;
  uf: string;
  issueDate: string;
  /** Local preview URIs (frente/verso). */
  photoUris: string[];
  /** S3 object keys aligned with `photoUris`. */
  photoKeys: string[];
};

export type PostgraduateEntry = {
  university: string;
  course: string;
  year: string;
};

/** Cities served within a single state; one entry per state. */
export type ServiceAreaEntry = {
  /** UF code, e.g. `SP`. */
  state: string;
  /** City names as listed by the cities catalog. */
  cities: string[];
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
  /** Local preview URIs for primary OAB card (frente + verso). */
  oabPhotoUris: string[];
  /** S3 keys aligned with `oabPhotoUris`. */
  oabPhotoKeys: string[];
  supplementalOabs: SupplementalOabEntry[];
  university: string;
  course: string;
  graduationYear: string;
  postgraduates: PostgraduateEntry[];
  practiceAreas: string[];
  specialties: string[];
  serviceAreas: ServiceAreaEntry[];
  /** Draft state of the "raio de atuação" editor; not submitted. */
  serviceDraftState: string;
  /** Draft cities of the "raio de atuação" editor; not submitted. */
  serviceDraftCities: string[];
  billingMethods: string[];
  pronouns: string;
  profileImageUri: string;
  /** S3 object key from POST /arquivos/url-upload (ADVOGADO_PERFIL). Required. */
  profileImageKey: string;
  biography: string;
};
