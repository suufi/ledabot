var mongoose = require('mongoose')
var Schema = mongoose.Schema

const stateAbbreviations = [
    'AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA',
    'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
    'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
    'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
    'VT','VI','VA','WA','WV','WI','WY'
];

var scholarSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    name: {
        type: String,
    },
    nickname: {
        type: String
    },
    cohort: {
        type: Number,
        default: 16
    },
    birthday: {
        type: Date
    },
    city: String,
    state: {
        type: String,
        enum: stateAbbreviations
    },
    school: {
        type: String
    },
    instagram: {
        type: String
    },
    snapchat: {
        type: String
    },
    twitter: {
        type: String
    },
    tiktok: {
        type: String
    },
    phone: {
        type: Number,
        validate: {
            validator: function(v) {
                return /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        }
    }
}, { strict: true })

const Scholar = mongoose.model('Scholar', scholarSchema)

exports.scholarModel = Scholar