const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: "./src/client/index.js", // نقطة الدخول الرئيسية
    output: {
        path: path.resolve(__dirname, "dist"), 
        filename: "bundle.js", 
        clean: true, 
    },
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"], 
                    },
                },
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), 
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/views/index.html", 
            filename: "index.html",
        }),
        new CleanWebpackPlugin({
            dry: false, 
            verbose: true, /
            cleanStaleWebpackAssets: true, 
            protectWebpackAssets: false,
        }),
    ],
};
