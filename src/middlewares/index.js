import { handleBodyRequestParsing, handleCors, handleHelmet, handleCompression } from './common.js';

export default [handleCors, handleBodyRequestParsing, handleHelmet, handleCompression];
