const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: path.join(__dirname,"src","index.js"),
  devtool: "inline-source-map",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    port:8000
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "file-loader",
        options: {
          outputPath: path.join(__dirname, "public", "assets"),
        },
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".ts", ".js",".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'public','index.html')
    }),
  ],
};
