
export interface Parametre {
  id: number;
  libelle: string;
}
export interface Mission {
  id: number;
  libelle: string;
  description: any;
  date_debut: any;
  date_fin: any;
  adresse_mission: any;
}


export interface Equipe {
  id: number;
  libelle: string;
  chef_equipe_id: number;
  chef_equipe: number;
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