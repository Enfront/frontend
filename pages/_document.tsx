import Document from 'next/document';

import { createGetInitialProps } from '@mantine/next';

const getInitialProps = createGetInitialProps();

class _Document extends Document {
  static getInitialProps = getInitialProps;
}

export default _Document;
