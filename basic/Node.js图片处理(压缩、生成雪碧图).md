
##  图片压缩

```
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
	await imagemin(['images/*.png'], {
		destination: 'build/images',
		plugins: [
			imageminPngquant()
		]
	});

	console.log('Images optimized');
})();
```


##  生成雪碧图

```
var fs = require("fs");
var path = require("path");
var list = [];
function listFile(dir){
	var arr = fs.readdirSync(dir);
	arr.forEach(function(item){
		var fullpath = path.join(dir,item);
		var stats = fs.statSync(fullpath);
		if(stats.isDirectory()){
			listFile(fullpath);
		}else{
			list.push(fullpath);
		}
	});
	return list;
}

var res = listFile(path.resolve(__dirname, 'build/images')).filter((item)=> item.indexOf('png') >= 0);

// Load in dependencies
var Spritesmith = require('spritesmith');

// Create a new spritesmith and process our images
var sprites = res;
var spritesmith = new Spritesmith();
spritesmith.createImages(sprites, function handleImages (err, images) {
  images[0].width; // Width of image
  images[0].height; // Height of image

  // Create our result
  var result = spritesmith.processImages(images, {
    algorithm: 'top-down'
  });
  result.image; // Readable stream outputting image
  result.coordinates; // Object mapping filename to {x, y, width, height} of image
  result.properties; // Object with metadata about spritesheet {width, height}

  var pngfile = fs.createWriteStream(path.resolve(__dirname, './sprite.png'));
  result.image.on('data', (chunk) => {
    pngfile.write(chunk);
  })

  result.image.on('end', () => {
    console.log('save success');
  })

});
```