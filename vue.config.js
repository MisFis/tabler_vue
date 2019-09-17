module.exports = {
  // настройки...
  devServer: {
    proxy: {
      '/api': {
        target: 'https://tabler.ru/',
      },
    },
  },
};
