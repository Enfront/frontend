module.exports = {
  output: 'standalone',
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  images: {
    domains: [
      'minio.jkshop.gg',
      'tailwindui.com',
      'unsplash.com',
      'images.unsplash.com',
      'jkpay.s3.us-east-2.amazonaws.com',
      'chart.googleapis.com',
    ],
  },
};
