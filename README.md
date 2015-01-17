## Data source
All data is taken from [SR2 database](http://www.ars.usda.gov/News/docs.htm?docid=18879)

## Running

```
git clone git@github.com:ilvar/nutria.git
cd nutria
meteor mongo --url
tar -xzvvf ./nutrients.tar.gz
mongoimport --host MONGO_HOST --port 27017 --username MONGO_USERNAME --password MONGO_PASSWORD --db MONGO_DB --collection products --type json --file ./products.json --jsonArray
mongoimport --host MONGO_HOST --port 27017 --username MONGO_USERNAME --password MONGO_PASSWORD --db MONGO_DB --collection cat_words --type json --file ./cat_words.json --jsonArray
mongoimport --host MONGO_HOST --port 27017 --username MONGO_USERNAME --password MONGO_PASSWORD --db MONGO_DB --collection cluster_centers --type json --file ./cluster_centers.json --jsonArray
meteor
```

or visit http://nutria.meteor.com