#!/usr/bin/env python
import json
import os
import openpyxl
import sklearn.cluster
import sklearn.preprocessing

print 'Opening Excel file'
wb = openpyxl.load_workbook(os.path.join('private', 'ABBREV.xlsx'), use_iterators=True)

print 'Loading Excel data'
rows = wb.worksheets[0].iter_rows()

captions = [c.internal_value for c in rows.next()]
used_captions = captions[:10] + captions[44:47]
params_captions = used_captions[3:]

all_data = [map(lambda c: c.internal_value or 0, r[:11] + r[44:47]) for r in rows if r[1].internal_value]

nutritional_data = [map(lambda v: float(v), r[3:]) for r in all_data]

print 'Normalizing data'
sklearn.preprocessing.normalize(nutritional_data, copy=False)

print 'Clusterizing data'
cluster = sklearn.cluster.KMeans(n_clusters=5)
data = map(int, cluster.fit_predict(nutritional_data))

print 'Writing products'
json_data = [dict(zip(captions, row)) for row in all_data]

for jd, cat in zip(json_data, data):
    description = ', '.join(jd['Shrt_Desc'].lower().split(','))
    jd.update({
        'Description': description.capitalize(),
        'Category': cat
    })

json.dump(json_data, open(os.path.join('private', 'products.json'), 'w'))

print 'Writing categories'
cats = {}

for jd, cat in zip(json_data, data):
    title = jd['Shrt_Desc']
    bits = title.split(',')

    if cat not in cats:
        cats[cat] = {}

    for bit in bits:
        if len(bit) <= 3:
            continue

        bit = bit.capitalize()

        if bit not in cats[cat]:
            cats[cat][bit] = 0

        cats[cat][bit] += 1

cat_words = []

cluster_centers = [dict(zip(params_captions, c)) for c in cluster.cluster_centers_]

for cat, cat_data in cats.items():
    words = list(map(list, cat_data.items()))
    words.sort(key=lambda v: v[1])
    words.reverse()
    words = words[:20]

    sizes = [36, 24, 18, 12, 12, 8, 8, 8, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4]
    for i, w in enumerate(words):
        w[1] = sizes[i]

    current_center = cluster_centers[cat]
    cluster_description = []
    short_captions = ['Energ_Kcal', 'Carbohydrt_(g)', 'Sugar_Tot_(g)', 'Fiber_TD_(g)', 'Protein_(g)']
    for c in short_captions:
        min_param = min([center[c] for center in cluster_centers])
        max_param = max([center[c] for center in cluster_centers])
        value = float(current_center[c] - min_param) / (max_param - min_param)
        if value > 0.65:
            cluster_description.append('high %s' % c.split('_')[0])
        if value < 0.35:
            cluster_description.append('low %s' % c.split('_')[0])

    cat_words.append({
        "Category": cat,
        "Words": words,
        "Cluster": {
            "data": current_center,
            "description": cluster_description,
            "descriptionString": ', '.join(cluster_description) or "Average",
        }
    })

json.dump(cat_words, open(os.path.join('private', 'cat_words.json'), 'w'))