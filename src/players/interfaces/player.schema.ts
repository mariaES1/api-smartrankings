import * as mongoose from 'mongoose';

export const playerSchema = new mongoose.Schema({
    email: { type: String, unique: true},
    phoneNumber: { type: String},
    name: String,
    ranking: String,
    rankingPosition: Number,
    urlPhoto: String
}, {timestamps: true, collection: 'players'});