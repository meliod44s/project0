const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
    mode: "production",
    devtool: "hidden-source-map",
    output: {
        filename: "bundle.[contenthash].js",
        path: path.resolve(__dirname, "dist"), 
        libraryTarget: "var",
        library: "Client",
        clean: true, 
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin({
                parallel: true, 
            }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.[contenthash].css",
        }),
    ],
});
