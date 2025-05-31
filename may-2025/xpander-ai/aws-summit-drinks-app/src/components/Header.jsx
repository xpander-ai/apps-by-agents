import React from 'react';
import { TopNavigation } from '@cloudscape-design/components';

export default function AppHeader() {
  return (
    <>
      <TopNavigation
        identity={{
          title: 'AWS Summit 2025',
          logo: { src: '/favicon.ico', alt: 'AWS Summit 2025 Logo' },
        }}
      />
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <img
          src="/favicon.ico"
          alt="AWS Summit 2025 Logo"
          style={{ width: 150, height: 'auto' }}
        />
        <h1>AWS Summit 2025: Find the Best Drinks</h1>
        <p>Your guide to the best drinks at the summit</p>
      </div>
    </>
  );
}