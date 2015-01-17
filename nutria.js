Products = new Mongo.Collection("products");

if (Meteor.isClient) {
    Template.products.helpers({
        products: function() {
            var search = Session.get("search");
            if (search && search.length > 1) {
                return Products.find({"Shrt_Desc": {$regex: search, $options: 'i'}});
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
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
