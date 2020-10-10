import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';

export default (): React.ReactNode => (
  <PageContainer
    style={{
      backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/gGlUMYGEIvjDOOw.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100%',
    }}
  >
    <div
      style={{
        color: 'white',
        fontFamily: 'monospace',
        margin: '20vh auto',
        width: '4rem',
        fontSize: '6vh',
      }}
    >
      Juan Manuel Bécares
    </div>
  </PageContainer>
);
