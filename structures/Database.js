const mongoose = require('mongoose')

const { Scholar } = require('../models')

mongoose.connect(process.env.MONGO_CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true })

exports.setField = function(userId, field, value) {
    return new Promise((resolve, reject) => {
        Scholar.findOne({ userId }).then((scholar) => {
            console.log(scholar)
            if (scholar) {
                Scholar.updateOne({ userId }, { $set: { [field]: value } }).then(() => { resolve(true) }).catch((err) => {
                    reject(err)
                })
            } else {
                Scholar.create({
                    userId,
                    [field]: value
                }).then(resolve(true)).catch(reject)
            }
        })
    })
}

exports.getScholarByUserId = function(userId) {
    return new Promise(((resolve, reject) => {
        Scholar.findOne({ userId }).then((scholar) => {
            if (scholar) {
                resolve(scholar)
            } else {
                resolve()
            }
        })
    }))
}

exports.Scholar = Scholar