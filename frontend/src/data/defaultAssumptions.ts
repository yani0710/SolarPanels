export const DEFAULT_ASSUMPTIONS = {
  pricePerKwhEur: 0.153,
  averageSunHours: 3.8,
  systemSafetyFactor: 1.2,
  batterySafetyFactor: 1.25,
  unknownBoilerKwhPerDay: 3.2,
  unknownApplianceConfidence: 0.55,
  minimumUsefulMonthlyBill: 65,
  heavyShadeProductionFactor: 0.45,
  partialShadeProductionFactor: 0.78
};

export const OBJECT_TYPE_LABELS = {
  apartment: 'Апартамент',
  house: 'Къща',
  villa: 'Вила',
  business: 'Малък бизнес',
  farm: 'Ферма / селски имот'
};

export const GOAL_LABELS = {
  save: 'Да намаля сметката',
  backup: 'Да имам резервно захранване',
  independence: 'Да стана по-независим',
  check: 'Да проверя дали има смисъл',
  offgrid: 'Автономност / слаб ток от мрежата'
};
