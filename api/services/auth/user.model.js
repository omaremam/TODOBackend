const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    email: { type: String, unique: true },
    password: String,
    name: String,
    nationality: String,
    phoneNumber: String,
    age: Number,
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"]
    },
    userType: {
      type: String,
      enum: ["Tourist","Inner_Tourism","Shop_Owner"]
    },
    isApproved: Boolean,
    resetPasswordCode: String
},
    {
        toJSON: {
            transform: function (doc, ret, options) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
)

userSchema.plugin(uniqueValidator);
const User = mongoose.model("User",userSchema);
module.exports = User;