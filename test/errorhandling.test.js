var path = require('path'),
    assert = require('assert'),
    fs = require('fs');

var carto = require('../lib/carto'),
    helper = require('./support/helper'),
    util = require('../lib/carto/util');

describe('Error handling mml+mss', function() {
helper.files('errorhandling', 'mml', function(file) {
    var basename = path.basename(file);
    it('should handle errors in ' + basename, function(done) {
        helper.mml(file, function (err, mml) {
            var output = {
                msg: null,
                data: null
            };

            if (!err) {
                output = new carto.Renderer({
                    paths: [ path.dirname(file) ],
                    data_dir: path.join(__dirname, '../data'),
                    local_data_dir: path.join(__dirname, 'rendering'),
                    filename: file
                }).render(mml);
            }
            else {
                output.msg = err;
            }
            // @TODO for some reason, fs.readFile includes an additional \n
            // at the end of read files. Determine why.
            var fixture = helper.resultFile(file);
            var actual = util.getMessagesToPrint(output.msg);
            if (process.env.UPDATE_FIXTURES) fs.writeFileSync(fixture, actual, 'utf8');
            var expected = fs.readFileSync(fixture, 'utf8');
            assert.deepEqual(actual, expected);
            done();
        });
    });
});
});

describe('Error handling mss', function() {
helper.files('errorhandling', 'mss', function(file) {
    var basename = path.basename(file);
    if (basename == 'multi_stylesheets_a.mss' ||
        basename == 'issue_29.mss') {
        return;
    }
    it('should handle errors in ' + basename, function(done) {
        var mss = helper.mss(file);
        var output = new carto.Renderer({
            paths: [ path.dirname(file) ],
            data_dir: path.join(__dirname, '../data'),
            local_data_dir: path.join(__dirname, 'rendering'),
            // note: we use the basename here so that the expected error result
            // will match if the style was loaded from mml
            filename: basename
        }).renderMSS(mss);
        // @TODO for some reason, fs.readFile includes an additional \n
        // at the end of read files. Determine why.
        var fixture = helper.resultFile(file);
        var actual = util.getMessagesToPrint(output.msg);
        if (process.env.UPDATE_FIXTURES) fs.writeFileSync(fixture, actual, 'utf8');
        var expected = fs.readFileSync(fixture, 'utf8');
        assert.deepEqual(actual, expected);
        done();
    });
});
});
