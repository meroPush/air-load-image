# [Air load image](https://github.com/meroPush/air-load-image)

Lazy loading of images and the background when scrolling.

Delay before checking the visibility of the element on the viewport, which provides more flexible configuration of the plugin.

## Installation

Via [npm](https://www.npmjs.com/package/air-load-image):

```sh
$ npm install npm install air-load-image
```

## Usage

Include jQuery library (slim build is recommended) and the Air Load Image plugin's script at the bottom of the page.
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="air-load-image.min.js"></script>
```

Embed your images and background images use the `data-air-img` attribute, which will auto change to the standard `src` attribute as the image(s) enter the viewport on vertical page scrolling.
```html
<img class="_air-load-image" 
     src="placeholder.jpg" 
     data-air-img="demo-img.jpg">

<div class="_air-load-image" 
     style="background-image: url('placeholder.jpg');" 
     data-air-img="demo-bg.jpg">
</div>
```

Active the image lazy load plugin with just one line of code.
```javascript
$('._air-load-image').airLoadImage();
```

## Plugin default options
```javascript
$('._air-load-image').airLoadImage({
    offset: '75%', // Offset relative to the viewport size
    delay: 750, // Delay in milliseconds before element visibility check
    pluginId: 'airLoadImage' // The identifier for the scrolling and resizing events
});
```

