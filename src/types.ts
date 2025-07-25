
export interface TypeMission {
  id: number;
  libelle: string;
  code: string;
}
export interface Parametre {
  id: number;
  libelle: string;
}
export interface Entreprise {
  id: number;
  libelle: string;
  email: string;
  tel: string;
  commentaire: string;
  adresse_geo: string;
}


export interface LigneEquipe {
  id: any;
  idF: any;
  equipeId: any;
  date_fin_intervention: any;
  date_debut_intervention: string;
  description: string;
}

export interface Mission {
  libelle: string;
  date_debut: string;
  entrepriseMagasin: Entreprise;
  description: any;
  adresse_mission: any;
  date_fin: string;
  typeMission: TypeMission;
  ligneEquipes: LigneEquipe[];
  inventaires: LigneEquipe[];
}
export interface MissionEdit {
  libelle: string;
  date_debut: string;
  entrepriseMagasin: Entreprise;
  entreprise_id:any
  description: any;
  adresse_mission: any;
  date_fin: string;
  type_mission_id:any;
  typeMission: TypeMission;
  ligneEquipes: LigneEquipe[];
  inventaires: LigneEquipe[];
}

export interface Equipe {
  id: number;
  libelle: string;
  chef_equipe_id: number;
  chefEquipe: {
    id:number,
    nom: string,
    prenoms: string
  };
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