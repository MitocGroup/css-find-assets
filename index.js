module.exports = find;

function find(tree, stripQueryString) {
    if (tree.stylesheet) {
        return find(tree.stylesheet);
    }

    var styles = tree,
        assets = [];

    if (styles.declarations) {
        styles.declarations.forEach(function(d) {
            var pattern = /url\(('[^')+'|"[^"]+"|[^\)]+)\)/g,
                m;
            while ((m = pattern.exec(d.value)) !== null) {
                var url = m[1]
                    .replace(/^['"]|['"]$/g, '');

                if (stripQueryString) {
                    url = url.replace(/[?#].*$/, '');
                }

                assets.push({
                    url: url,
                    node: d,
                    position: {
                        index: m.index,
                        length: m[0].length
                    }
                });
            }
        });
    }

    if (styles.rules) {
        styles.rules.forEach(function(rule) {
            assets = assets.concat(find(rule));
        });
    }

    return assets;
}
