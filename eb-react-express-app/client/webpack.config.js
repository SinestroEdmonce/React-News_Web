const htmlWebpackPlugin = require('html-webpack-plugin'); 
const path = require('path');

const htmlPlugin = new htmlWebpackPlugin({
    template: path.join(__dirname, "./src/index.html"),
    filename: "index.html"
});

const config = {
    // mode: "development",
    mode: "production",   
    entry: {    
        main: path.resolve(__dirname,'./src/index.js')
    },
    output: {   
        path: path.resolve(__dirname,'./dist'),
        filename: 'bundle.js',
        // Only for the production
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                use: "babel-loader",
                include: [
                    path.resolve(__dirname, 'src')
                ],
                exclude: /node_modules/
            }, 
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    }, 
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[name]__[local]___[hash:base64:7]"
                            }
                        }
                    }, 
                    {
                        loader: "sass-loader"
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                use: ["url-loader"]
            },
            {
                test: /\.(eot|ttf|wav|mp3)$/,
                use: ["file-loader"]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        alias: {
            "@": path.join(__dirname, "./src")
        }
    },
    plugins: [
        htmlPlugin
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        port: 8000,
        proxy: {
            "/G/*": {
                target: "http://localhost:8001",
                changeOrigin: true,
                secure: false
            },
            "/NY/*": {
                target: "http://localhost:8001",
                changeOrigin: true,
                secure: false
            },
            "/public/*": {
                target: "http://localhost:8001",
                changeOrigin: true,
                secure: false
            }
        }
    },
    // Only need in development mode
    // devtool: "eval-source-map"
};

module.exports = config;