var mongoose = require('mongoose');
 
var imageSchema = new mongoose.Schema({
    created: { type: Date, default: Date.now },
    name: { type: String, default: "file name" },
    description: { type: String, default: "file description" },
    modified: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    image:
    {
        data: Buffer,
        contentType: String
    }
});

mongoose.model('images', imageSchema);
 
module.exports = new mongoose.model('images', imageSchema);