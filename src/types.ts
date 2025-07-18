
export interface Parametre {
  id: number;
  libelle: string;
}
export interface Equipe {
  id: number;
  libelle: string;
  description: any;
}

export interface User {
  id: number;
  nom: string;
  prenoms: string;
  tel: string;
  email: string;
  token: string;
  d_type: string; // admin/agent/client
  //created_at: string; // Date in ISO format

}