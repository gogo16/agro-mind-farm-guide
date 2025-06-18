
export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Field {
  id: string;
  user_id: string;
  nume_teren: string;
  cod_parcela: string;
  suprafata: number;
  cultura?: string;
  varietate?: string;
  data_insamantare?: string;
  data_recoltare?: string;
  culoare?: string;
  ingrasaminte_folosite?: string;
  coordonate_gps?: Coordinate | Coordinate[] | null;
  created_at: string;
  updated_at: string;
  data_stergerii?: string;
  istoric_activitati?: any[];
}

export interface CreateFieldData {
  nume_teren: string;
  cod_parcela: string;
  suprafata: number;
  cultura?: string;
  varietate?: string;
  data_insamantare?: string;
  data_recoltare?: string;
  culoare?: string;
  ingrasaminte_folosite?: string;
  coordonate_gps?: Coordinate | Coordinate[];
}

export interface UpdateFieldData extends Partial<CreateFieldData> {}
