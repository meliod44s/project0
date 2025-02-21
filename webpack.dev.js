const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    devtool: "source-map", // يمكنك تغييره إلى 'inline-source-map' لسرعة أعلى
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dev"), // إخراج الملفات في مجلد 'dev'
        libraryTarget: "var",
        library: "Client",
        clean: true, // تنظيف المجلد قبل الإخراج
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
    devServer: {
        static: path.join(__dirname, "dev"), // تحديد مجلد التشغيل
        compress: true,
        port: 8080,
        hot: true, // تفعيل HMR (تحديث فوري عند التعديل)
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(), // تحسين CSS
        ],
        minimize: true,
    },
});
