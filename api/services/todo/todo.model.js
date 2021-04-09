const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    listName: String,
    items: [
        {
            itemName: String,
            itemStatus: {
                type: String,
                enum: ["DONE", "PENDING"]
            }
        }
    ]
}, {
    toJSON: {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;