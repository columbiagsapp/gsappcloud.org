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
    name: {
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
RepoSchema.path('name').validate(function(name) {
    return name.length;
}, 'Repo name cannot be blank');


mongoose.model('Repo', RepoSchema);