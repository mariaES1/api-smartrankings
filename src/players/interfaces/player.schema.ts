import * as mongoose from 'mongoose';

export const playerSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true},
    email: { type: String, unique: true},
    name: String,
    ranking: String,
    rankingPosition: Number,
    urlPhoto: String
}, {timestamps: true, collection: 'players'});