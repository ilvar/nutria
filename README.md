## Data source
All data is taken from [SR2 database](http://www.ars.usda.gov/News/docs.htm?docid=18879)

## Running

```
git clone git@github.com:ilvar/nutria.git
cd nutria
meteor
```

or visit http://nutria.meteor.com

## Manual re-clusterizing

```
virtualenv ENV
source ./ENV/bin/activate
pip install openpyxl numpy scikit-learn
python clusterize.py
```
