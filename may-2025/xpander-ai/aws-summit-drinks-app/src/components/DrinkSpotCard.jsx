import React from 'react';
import { Card } from '@cloudscape-design/components';

export default function DrinkSpotCard({ spot }) {
  return (
    <Card
      header={spot.name}
      subheader={spot.location}
      description={spot.description}
      info={<p>{spot.openingHours}</p>}
    />
  );
}