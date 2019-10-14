import React from "react";
import CMS from "netlify-cms-app";

// Import main site styles as a string to inject into the CMS preview pane
import styles from "!to-string-loader!css-loader!postcss-loader!sass-loader!../scss/app.scss";

import CaseStudies from "./cms-previews-templates/case-studies";

CMS.registerPreviewStyle(styles, { raw: true });
CMS.registerPreviewTemplate("case-stuides",CaseStudies);

CMS.init();
