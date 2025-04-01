
Schema source is located at https://github.com/AnalyticalGraphicsInc/czml-writer
download it or submodule it to `3dparty/czml-writer`

```bash
# using curl
curl -L https://github.com/AnalyticalGraphicsInc/czml-writer/archive/refs/heads/main.zip | busybox unzip -
mv czml-writer-main 3dparty/czml-writer

# using git submodule
git submodule add git@github.com:AnalyticalGraphicsInc/czml-writer.git 3dparty/czml-writer
```

To generate TS types out of json schema:

```bash
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Billboard.json -o src/czml-ext/schema/billboard.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Label.json -o src/czml-ext/schema/label.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Box.json -o src/czml-ext/schema/box.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Cylinder.json -o src/czml-ext/schema/cylinder.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Model.json -o src/czml-ext/schema/model.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Path.json -o src/czml-ext/schema/path.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Point.json -o src/czml-ext/schema/point.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Polygon.json -o src/czml-ext/schema/polygon.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Polyline.json -o src/czml-ext/schema/polyline.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Rectangle.json -o src/czml-ext/schema/rectangle.d.ts
npx json2ts --cwd=3dparty/czml-writer/Schema -i 3dparty/czml-writer/Schema/Tileset.json -o src/czml-ext/schema/tileset.d.ts
```