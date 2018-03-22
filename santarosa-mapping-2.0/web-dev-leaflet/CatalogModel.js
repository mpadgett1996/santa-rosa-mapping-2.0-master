/**
 * Created by michellepadgett on 4/24/17.
 */


/*Defines schema for saving Catalog information*/

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CatalogSchema = new Schema({
    place: { type: String},
    name: { type: String},
    address: { type: String},
    type_of_place: { type: String},
    why: { type: String},
    image: {type: String},
    date: { type: Date, default: Date.now }
})


//var test = new Catalog({ name: 'Test' });
//console.log(test.name); // 'Silence'


CatalogSchema.methods.speak = function () {
    var greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
    console.log(greeting);
}

/* catalog = collection */
var Catalog = mongoose.model('catalog', CatalogSchema);

var fluffy = new Catalog();

/*fluffy.name = 'testing123';

fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);

});
*/

Catalog.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
})

