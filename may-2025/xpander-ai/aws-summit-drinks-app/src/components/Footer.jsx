import React from 'react';
import { Box, Link, SpaceBetween } from '@cloudscape-design/components';

export default function Footer() {
  return (
    <Box variant="footer" padding={{ vertical: 'xs', horizontal: 'l' }}>
      <SpaceBetween size="xs">
        <Link variant="primary" external href="https://aws.amazon.com">
          AWS Official Site
        </Link>
        <span>© {new Date().getFullYear()} AWS Summit 2025</span>
      </SpaceBetween>
    </Box>
  );
}