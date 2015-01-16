Products = new Mongo.Collection("products");

if (Meteor.isClient) {
    Template.data.helpers({
        loaded: function() {
            if (!Session.get("new_uploaded")) {
                var result = !Products.findOne({});
                if (result) {
                    Session.set("new_uploaded", 1);
                }
            }
            Session.set("new_loaded", 1);
            return true;
        },
        products_not_exist: function() {
            if (top.location.hash.indexOf('upload') > -1) {
                return true;
            }

            var result = !Session.get("new_uploaded");
            var first;
            if (result) {
                first = !Products.findOne({});
                if (first) {
                    Session.set("new_uploaded", 1);
                    result = false;
                }
            }
            Session.set("new_loaded", 1);
            return result;
        }
    });

    Template.products.helpers({
        products: function() {
            var search = Session.get("search");
            if (search && search.length > 1) {
                return Products.find({"Shrt_Desc": {$regex: '^' + search + '.*', $options: 'i'}});
            } else {
                return []
            }
        },
        search: function() {
            return Session.get("search") || '';
        }
    });

    Template.search.helpers({
        search: function() {
            return Session.get("search") || '';
        }
    });

    Template.item.helpers({
        properties: function() {
            return _.compact(_.map(this, function(v,k) {
                if (k && v && k[0] != "_" && k != "Shrt_Desc" && k != "NDB_No" && k != "Category") {
                    return {
                        name: k.replace("_", " "),
                        value: v
                    }
                } else {
                    return null;
                }
            }))
        }
    });

    Template.search.events({
        'keyup input': function(e, template) {
            Session.set("search", event.target.value);
        }
    });

    Template.upload.events({
        'submit form': function (e, template) {
            e.preventDefault();
            var file = $('form.upload input[type=file]').get(0).files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var csv = e.target.result;
                var result = Papa.parse(csv);
                var captions = result.data.splice(0, 1);  // Using captions
                _.each(result.data, function(row) {
                    var obj = _.object(captions[0], row);
                    if (obj.Shrt_Desc) {
                        Products.insert(obj);
                        console.log('Inserted ', obj.Shrt_Desc);
                    } else {
                        console.log('Skipped ', obj);
                    }
                });
            };
            reader.readAsText(file);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
