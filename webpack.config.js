/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const { bundler } = require( '@ckeditor/ckeditor5-dev-utils' );
const UglifyJsWebpackPlugin = require( 'uglifyjs-webpack-plugin' );

module.exports = {
	context: __dirname,

	devtool: 'source-map',
	performance: { hints: false },
	externals: {
		omi: {
			root: 'omi',
			commonjs2: 'omi',
			commonjs: 'omi',
			amd: 'omi'
		}
	},

	entry: path.join( __dirname, 'src', 'ckeditor.js' ),

	output: {
		library: 'CKEditor',

		path: path.join( __dirname, 'dist' ),
		filename: 'ckeditor.js',
		libraryTarget: 'umd',
		libraryExport: 'default',

	},

	optimization: {
		minimizer: [
			new UglifyJsWebpackPlugin( {
				sourceMap: true,
				uglifyOptions: {
					output: {
						// Preserve CKEditor 5 license comments.
						comments: /^!/
					}
				}
			} )
		]
	},

	plugins: [
		new webpack.BannerPlugin( {
			banner: bundler.getLicenseBanner(),
			raw: true
		} ),
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					compact: false,
					presets: [ 
						'@babel/preset-env', 
						[
							"@babel/preset-react",
							{
								"pragma": "Omi.h"
							}
						] 
					],
					plugins: [
						"@babel/plugin-proposal-class-properties",
						"@babel/transform-runtime",
						[
							"@babel/plugin-proposal-decorators",
							{
								"legacy": true
							}
						],
						"@babel/plugin-proposal-function-bind",
						"@babel/plugin-proposal-object-rest-spread",
						"@babel/plugin-syntax-dynamic-import"
					]
				}
			}
		]
	},
};
