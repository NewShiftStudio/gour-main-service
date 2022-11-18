export type AmoCrmStatus = {
  id: number;
  name: string;
  color: string;
};

export type AmoCrmLead = {
  id: number;
  name: string;
  price: number;
  status_id: number;
  pipeline_id: number;
};

export type AmoCrmInfo = {
  id: number;
  status: AmoCrmStatus;
};

export type AmoCrmAuthData = {
  access_token: string;
  refresh_token: string;
};
