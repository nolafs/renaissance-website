import CMS from "decap-cms-app";
import Immutable from "immutable";
import {marked} from "marked";

// Import main site styles as a string to inject into the CMS preview pane
import styles from '!to-string-loader!css-loader?{"url":false}!postcss-loader!sass-loader!../scss/cms.scss';

import CaseStudies from "./cms-previews-templates/case-studies";

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
		const images = Immutable.fromJS(obj.images || []);
		return (
			'{{< gallery images="' +
			images.map((v, i) => v.get("image")).join(",") +
			'" >}}'
		);
	},
	toPreview: function (obj) {
		const images = Immutable.fromJS(obj.images || []);
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
