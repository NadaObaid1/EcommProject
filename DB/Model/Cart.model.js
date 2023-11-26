import mongoose, {Schema, model, Types} from 'mongoose'

const cartSchema = new Schema({
userId: {
type: Types.ObjectId,
ref: 'User',
required: true,
unique: true
},
products : [{
productId: {type: Types. ObjectId, ref: 'Product', required: true}, //من خلالها بجيب اي معلومات عن البرودكت
quantity: {type:Number, default:1, required: true}
}],
},
{
    timestamps: true,
}
)

const cartModel = mongoose.models.Cart || model('Cart', cartSchema);
export default cartModel;
