export interface AirQualityData {
  europeanAqi: number;
  pm2_5: number;
  pm10: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
  ozone: number;
  time: string;
}

export interface AirQualityResponse {
  current: {
    european_aqi?: number;
    pm2_5?: number;
    pm10?: number;
    carbon_monoxide?: number;
    nitrogen_dioxide?: number;
    sulphur_dioxide?: number;
    ozone?: number;
    time?: string;
  };
}

export interface AqiInfo {
  value: number;
  level: string;
  color: string;
  description: string;
}