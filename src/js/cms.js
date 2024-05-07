import CMS from "decap-cms-app";

import {marked} from "marked";

// Import main site styles as a string to inject into the CMS preview pane
import styles from '!to-string-loader!css-loader?{"url":false}!postcss-loader!sass-loader!../scss/cms.scss';

import CaseStudies from "./cms-previews-templates/case-studies";
import {fromJS} from 'immutable';

CMS.registerPreviewStyle(styles, { raw: true });
CMS.registerPreviewTemplate("case-studies",CaseStudies);

CMS.registerEditorComponent({
	id: "youtube",
	label: "Youtube",
	fields: [{name: "id", label: "Youtube Video ID"}],
	pattern: /^{{<\s?youtube (\S+)\s?>}}/,
	fromBlock: function (match) {
		return {
			id: match[1],
		};
	},
	toBlock: function (obj) {
		return "{{< youtube " + obj.id + " >}}";
	},
	toPreview: function (obj) {
		return (
			'<img src="http://img.youtube.com/vi/' +
			obj.id +
			'/maxresdefault.jpg" alt="Youtube Video"/>'
		);
		{
		}
	},
});

CMS.registerEditorComponent({
	id: "imageSize",
	label: "Image Size",
	fields: [
		{name: "image", label: "Image", widget: "image" , required: true},
		{name: "alt", label: "alt", widget: "string", required: true},
		{name: "width", label: "width", widget: "string"},
		{name: "height", label: "height", widget: "string", hint: "Optional: required if fill or fit is selected"},
		{name: "processing", label: "Processing", widget: "select", options: ["resize", "crop", "fit", "fill"], default: "resize",  hint: "resize: Resizes the image to fit within the specified dimensions. crop: Crops the image to the specified dimensions. fit: Resizes the image to fit within the specified dimensions, without distorting the image. fill: Resizes the image to fit within the specified dimensions, distorting the image if necessary."}
	],
	pattern: /^{{<\s?imageSize.*\s?>}}/,
	fromBlock: function (match) {
		const fullMatch = match[0];
		const extractAttribute = (attrName) => {
			const regex = new RegExp(`${attrName}="([^"]+)"`);
			const match = regex.exec(fullMatch);
			return match ? match[1] : null;
		};

		return {
			image: extractAttribute('image'),
			alt: extractAttribute('alt'),
			width: extractAttribute('width'),
			processing: extractAttribute('processing'),
			height: extractAttribute('height') // Optional: include this if you decide to handle height as well.
		};
	},
	toBlock: obj => {

		const { image, alt, width, height, processing } = obj

		const shortcode =  `{{< imageSize image="${image}"  alt="${alt}" ${(width) ? `width="${width}"` : ''} ${ (height) ? `height="${height}"` : ''} processing="${processing}">}}`

		return (
			shortcode
		)
	},
	toPreview: function (obj) {
		const imageUrl = obj.image.startsWith('http') ? obj.image : `https://placehold.co/${obj.width || 300}x${obj.height ? obj.height : ''}`;
		const altText = obj.alt || 'Image preview';
		const widthStyle = obj.width ? `width: ${obj.width}px;` : 'width: auto;';
		return `<img src="${imageUrl}" alt="${altText}" style="${widthStyle} max-width: 100%; height: auto;">`;
	},
});


CMS.registerEditorComponent({
	id: "columns",
	label: "Columns",
	fields: [
		{name: "left", label: "Left", widget: "markdown"},
		{name: "right", label: "Right", widget: "markdown"}
	],
	pattern: /^{{<\s?columns\s?left="(.+)"\s?right="(.+)"\s?>}}/,
	fromBlock: function (match) {
		return {
			left: match[1],
			right: match[2],
		};
	},
	toBlock: function (obj) {
		return '{{< columns left="' + obj.left + '" right="' + obj.right + '" >}}';
	},
	toPreview: function (obj) {
		return (
			'    <div class="grid-x grid-margin-x align-center-middle">' +
			'        <div class="cell small-12 medium-auto">' + marked.parse(obj.left) + '</div>' +
			'        <div class="cell small-12 medium-auto">' + marked.parse(obj.right) + '</div>' +
			'    </div>'
		);
	},
});

CMS.registerEditorComponent({
	id: "gallery",
	label: "Gallery",
	fields: [
		{
			name: "images",
			label: "Images",
			widget: "list",
			fields: [
				{
					name: "image",
					label: "Image",
					widget: "image",
					media_folder: "/site/assets/images/gallery/",
					public_folder: "/images/gallery/",
				},
			],
		},
	],
	pattern: /^{{<\s?gallery images="(\S+)"\s?>}}/,
	fromBlock: function (match) {
		const images = match[1]
			.split(",")
			.filter((val) => val)
			.map((image) => ({image}));
		return {
			images: Immutable.fromJS(images),
		};
	},
	toBlock: function (obj) {
		const images = fromJS(obj.images || []);
		return (
			'{{< gallery images="' +
			images.map((v, i) => v.get("image")).join(",") +
			'" >}}'
		);
	},
	toPreview: function (obj) {
		const images = fromJS(obj.images || []);
		const list = images.map((v, i) => ("<li id='carousel__slide" + i + "' tabindex='" + i + "' class='carousel__slide'> " +
			"<img src='" + v.get("image") + "'/>" +
			"<div class=\"carousel__snapper\">\n" +
			" </div>" +
			"<div class=\"carousel__controls\">" +
			"<label class=\"carousel__control carousel__prev\" for=\"{{$slideId}}-{{sub $i 1}}\"></label>" +
			"<label class=\"carousel__control carousel__next\" for=\"{{$slideId}}-0\"></label>" +
			"</div>" +
			"</li>"));
		return (
			'<section class="carousel" aria-label="Gallery"><ol class="carousel__viewport">' +
			list.map(v => v).join('') +
			'</ol>' +
			'<div class="carousel__icon-next"><i class="icon fas fa-chevron-right"></i></div>\n' +
			'<div class="carousel__icon-prev"><i class="icon fas fa-chevron-left"></i></div>' +
			'</section>'
		);
	},
});

CMS.init();
