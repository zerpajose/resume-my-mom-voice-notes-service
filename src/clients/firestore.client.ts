import { Firestore } from '@google-cloud/firestore';
import config from '../config/environment.js';

/**
 * Firestore client
 * @type {Firestore}
 * @see https://googleapis.dev/nodejs/firestore/latest/Firestore.html
 */
export const db = new Firestore({
  projectId: config.googleProjectName,
});
