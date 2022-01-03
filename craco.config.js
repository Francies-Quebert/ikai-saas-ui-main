const CracoLessPlugin = require("craco-less");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // 033F63
              //  "@primary-color": "#1890ff"
              "@primary-color": "#41527d",
              "@font-size-base": "14px",
              "@link-color": "#aa3a3a",
            },

            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
