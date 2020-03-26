export interface Report {
  id: string;
  model: string;
  kmsSinceLastFill: number;
  liters: number;
  litersPerKms: number;
  date: number;
  image?: string;
}
