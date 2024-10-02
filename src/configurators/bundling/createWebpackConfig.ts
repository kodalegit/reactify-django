import { promises as fs } from "fs";
import path from "path";

export async function createWebpackConfig(
  appName: string,
  useTypescript: boolean,
  appPath: string
) {
  const config = `
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';
module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/index.${
      useTypescript ? "tsx" : "jsx"
    }',  // Adjust entry point for TS/JS
    output: {
        path: path.resolve(__dirname, 'static/${appName}/js'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            isDevelopment && require.resolve('react-refresh/babel')
                        ].filter(Boolean),
                    },
                },
            },
            {
                test: /\\.css$/,  // Apply this rule to CSS files
                use: [
                    'style-loader',  // Inject CSS into the DOM
                    'css-loader',    // Resolves @import and url() paths
                    'postcss-loader' // Process Tailwind and Autoprefixer via PostCSS
                ],
            },
            ${
              useTypescript
                ? `
            {
                test: /\\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            `
                : ""
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'${
          useTypescript ? ", '.ts', '.tsx'" : ""
        }],
    },
    plugins: [
        isDevelopment && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    devServer: {
        static: {
            directory: path.join(__dirname, 'static/${appName}/js'),
        },
        hot: true, // Enable hot module reloading
        port: 3000,
        compress: true,
        client: {
            logging: "error",
            overlay: true,
        },
        devMiddleware: {
            writeToDisk: true,
        }
    },
};
`;

  try {
    const filePath = path.join(appPath, "webpack.config.js");
    await fs.writeFile(filePath, config);
    console.log("Successfully created webpack.config.js");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unexpected error occurred");
    }
    throw error;
  }
}
