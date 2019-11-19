module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true
        },
        loose: true
      }
    ]
  ],
  plugins: [
    ['@babel/plugin-transform-react-jsx', { pragma: 'Flinch.create' }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-export-default-from'
  ]
};
