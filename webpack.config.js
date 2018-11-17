const path = require('path');
const {GenerateSW} = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    resolve: {
        extensions: ['.ts','.js']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['raw-loader']
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['awesome-typescript-loader']
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        compress: true,
        port: 9001
    },
    plugins: [
        new GenerateSW()
    ]
};
