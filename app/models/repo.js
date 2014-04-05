/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Repo Schema
 */
var RepoSchema = new Schema({
    added_time: {
        type: String,
        default: '',
        trim: false
    },
    reponame: {
        type: String,
        default: '',
        trim: false
    },
    username: {
        type: String,
        default: '',
        trim: false
    },
    downloads: {
        type: Number,
        default: 0
    }
});

/**
 * Validations
 */
RepoSchema.path('reponame').validate(function(reponame) {
    return reponame.length;
}, 'Repo name cannot be blank');


mongoose.model('Repo', RepoSchema);