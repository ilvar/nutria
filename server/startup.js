Meteor.startup(function () {
    console.log('Cleaning up products...');
    Products.remove({});

    console.log('Loading products to the collection...');
    _.each(JSON.parse(Assets.getText('products.json')), function (product) {
        Products.insert(product);
    });

    console.log('Loaded ' + Products.find().count() + ' products');

    console.log('Cleaning up categories...');
    Categories.remove({});

    console.log('Loading categories to the collection...');
    _.each(JSON.parse(Assets.getText('cat_words.json')), function (category) {
        Categories.insert(category);
    });

    console.log('Loaded ' + Categories.find().count() + ' categories');
});