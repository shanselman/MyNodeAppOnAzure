
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
  webshot(req.query.url, 'output-thumbnail.png', optionsMobile, function (err) {
    if (!err) {
      console.log('screenshot taken!');

      res.status(200).json({
        'id': 'some image',
        'imgEncoded': base64_encode('output-thumbnail.png')
      });
    }
  });
};

var base64_encode = function (file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}