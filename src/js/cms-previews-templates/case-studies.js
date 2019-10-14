import React from "react";


export default class CaseStudies extends React.Component {

    render() {
        const {entry, getAsset, widgetFor} = this.props;

        return <div>
            <div className="grid-container full" id="root">

                <div className="grid-container full block header single">
                    <div className="grid-container">
                        <div className="grid-x grid-padding-x grid-margin-y align-middle">
                            <div className="cell small-12 medium-8">
                                <img src={ getAsset(entry.getIn(["data", "image"])) } alt=""/>
                            </div>
                            <div className="cell small-12 medium-4 align-self-center f-c-black single-header">
                                <h2><small>{entry.getIn(["data", "heading"])}</small>{entry.getIn(["data", "categories"])}</h2>
                                <p>{entry.getIn(["data", "client"])}</p>

                            </div>
                        </div>
                        <div className="lightning">
                            <img src="/images/lightning-section.png" />
                        </div>
                    </div>
                </div>
            <div className="grid-container single-article">
                <div className="grid-x grid-padding-x">
                    <div className="cell small-12 medium-8">
                     <article>
                        { widgetFor("body") }
                    </article>
                    </div>
                    <div className="cell small-12 medium-4">
                        <div class="single-social-share">
                            <ul class="no-bullet">

                                <li class="">
                                    <div class="social-block facebook">
                                        <a href="https://www.facebook.com/sharer/sharer.php?u=https://eloquent-curran-2d10a7.netlify.com/case-studies/synced-off-planet/" aria-label="Facebook" target="_blank"><svg class="svg-inline--fa fa-facebook-f fa-w-10 icon" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg><!-- <i class="icon fab fa-facebook-f"></i> --></a>
                                    </div>
                                </li>

                                <li class="">
                                    <div class="social-block twitter">
                                        <a href="http://twitter.com/share?text=test&amp;url=https://eloquent-curran-2d10a7.netlify.com/case-studies/synced-off-planet/" aria-label="Twitter" target="_blank"><svg class="svg-inline--fa fa-twitter fa-w-16 icon" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg><!-- <i class="icon fab fa-twitter"></i> --></a>
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>;

    }
}
