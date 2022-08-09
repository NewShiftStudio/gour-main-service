export class LeadDto {
  id: number;
  name: string;
  status: {
    id: number;
    name: string;
    color: string;
  };
}
