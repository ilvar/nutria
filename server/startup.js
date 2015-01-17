Meteor.startup(function () {
    if (Products.find().count() == 0) {
        console.log('Loading products to the collection...');

        _.each(JSON.parse(Assets.getText('products.json')), function (product) {
            Products.insert(product);
        });

        console.log('Loaded ' + Products.find().count() + ' products');
    }

    if (Categories.find().count() == 0) {
        console.log('Loading categories to the collection...');

        _.each(JSON.parse(Assets.getText('cat_words.json')), function (category) {
            Categories.insert(category);
        });

        console.log('Loaded ' + Categories.find().count() + ' categories');
    }

    if (ClusterCenter.find().count() == 0) {
        console.log('Loading cluster centers to the collection...');

        _.each(JSON.parse(Assets.getText('cluster_centers.json')), function (cluster_center) {
            ClusterCenter.insert(cluster_center);
        });

        console.log('Loaded ' + ClusterCenter.find().count() + ' cluster centers');
    }
});