export interface DrinkLocation {
  id: number;
  name: string;
  description: string;
  link?: string;
}

export const drinkLocations: DrinkLocation[] = [
  {
    id: 1,
    name: 'The Cloud Lounge',
    description: 'Experience handcrafted cocktails at the heart of AWS Summit 2025.',
    link: 'https://example.com/cloud-lounge',
  },
  {
    id: 2,
    name: 'Serverless Sips',
    description: 'Refreshing beverages powered by serverless innovation.',
    link: 'https://example.com/serverless-sips',
  },
  {
    id: 3,
    name: 'Lambda Libations',
    description: 'Raise a toast to Lambda functions with specialty drinks.',
    link: 'https://example.com/lambda-libations',
  },
];
